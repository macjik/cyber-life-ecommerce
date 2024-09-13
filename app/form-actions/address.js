'use server';

import Joi from 'joi';
import db from '@/models/index';
db.sequelize.sync();
import { jwtVerify } from 'jose';
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

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      let { id } = payload;

      let exisitingUser = await User.findOne({ where: { sub: id } });
      if (!exisitingUser) {
        redirect('/auth');
        return;
      }

      exisitingUser.address = `${value.street}, ${value.city}`;
      await exisitingUser.save();

      return { id, status: 200 };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { error: `${error}`, status: 400 };
    }
  } else {
    redirect('/auth');
  }

}
