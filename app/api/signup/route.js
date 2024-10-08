import 'server-only';
import db from '@/models/index';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

db.sequelize.sync();
const { User } = db;

export async function POST(req) {
  try {
    const { userData, sms } = await req.json();
    const { phone, password } = userData;

    // Ensure all the required fields are present.
    if (!phone || !password || !sms) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: `Sorry, a user with phone: ${phone} already exists` }),
        { status: 409 },
      );
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 9);
    const uid = uuidv4();

    await User.create({
      role: 'user',
      hash: hashedPassword,
      phone: phone,
      sub: uid,
    });

    // Generate JWT token
    let token = jwt.sign({ id: uid, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie with the JWT token
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      sameSite: 'lax',
      path: '/',
    });

    console.log('User created successfully:', phone);
    return new Response(JSON.stringify({ status: 200, phone: phone }), { status: 200 });
  } catch (err) {
    console.error('Error occurred:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
