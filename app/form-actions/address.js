'use server';

import Joi from 'joi';
import db from '@/models/index';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
const User = db.User;

export async function setAddress(state, formData) {
  const schema = Joi.object({
    city: Joi.string().required(),
    street: Joi.string().min(6).pattern(/\d/, 'contains a number').required(),
  });

  const { value, error } = schema.validate({
    city: formData.get('city'),
    street: formData.get('street'),
  });

  if (error) {
    console.error('ValidationError:', error);
    return { error: `${error}` };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      let { id } = payload;

      // Find the existing user by the sub (id in JWT)
      let existingUser = await User.findOne({ where: { sub: id } });
      if (!existingUser) {
        redirect('/auth');
        return;
      }

      // Update the user's address
      existingUser.address = `${value.street}, ${value.city}`;
      await existingUser.save();

      // Update the JWT payload with the new address field
      payload.address = true;

      // Re-sign the existing token with the updated payload
      const newToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);

      // Set the updated JWT as a cookie
      cookieStore.set('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        sameSite: 'lax',
        path: '/',
      });

      return { id, status: 200 };
    } catch (error) {
      console.error('Token verification or signing failed:', error);
      return { error: `${error}`, status: 400 };
    }
  } else {
    redirect('/auth');
  }
}
