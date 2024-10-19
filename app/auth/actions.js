'use server';

import 'dotenv';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';
import db from '@/models/index';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import client from '../services/redis';
import axios from 'axios';
import FormData from 'form-data';
import { MINUTE, DAY } from 'time-constants';
import { revalidatePath } from '@/node_modules/next/cache';

// if (process.env.NODE_ENV !== 'production') {
//   db.sequelize.sync();
// }
const User = db.User;

// export async function signup(state, formData) {
//   const schema = Joi.object({
//     password: Joi.string().min(6).trim().required(),
//     phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
//     inviteCode: Joi.string().allow(''),
//     sms: Joi.number().min(4).required(),
//   });

//   try {
//     const { value, error } = schema.validate({
//       password: formData.get('password'),
//       phone: formData.get('phone').toString(),
//       sms: formData.get('sms-confirm').toString(),
//     });

//     if (error) {
//       console.error('Validation error:', error);
//       return { error: `${error}` };
//     }

//     const { password, phone, inviteCode, sms } = value;

//     let existingUser = await User.findOne({ where: { phone } });
//     if (existingUser) {
//       return { error: `Invalid phone number or password` };
//     }

//     let smsCode = await client.get(phone.toString());

//     if (smsCode !== sms.toString()) {
//       return { error: 'Invalid Code' }
//     }
//     await client.del(phone);

//     const hashedPassword = await bcrypt.hash(password, 9);
//     const uid = uuidv4();

//     await User.create({
//       role: 'user',
//       hash: hashedPassword,
//       phone: phone,
//       sub: uid,
//     });

//     let token = jwt.sign({ id: uid, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     await cookies().set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 3600,
//       sameSite: 'lax',
//       path: '/',
//     });

//     console.log('User created successfully:', phone);
//     revalidatePath('/');
//     return { status: 200 };
//   } catch (err) {
//     console.error('Error occurred:', err);
//     return { error: 'Internal server error' };
//   }
// }

export async function login(state, formData) {
  const schema = Joi.object({
    // name: Joi.string().min(2).trim().required(),
    phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
    password: Joi.string().min(6).trim().required(),
  });

  try {
    const { value, error } = schema.validate({
      // name: formData.get('name'),
      phone: formData.get('phone').toString(),
      password: formData.get('password'),
    });

    if (error) {
      console.error('Validation error:', error);
      return { error: `${error}` };
    }

    const { password, phone } = value;

    let existingUser = await User.findOne({
      where: { phone },
      attributes: ['hash', 'role', 'sub'],
    });
    if (!existingUser) {
      console.error('User not found');
      return { error: `User not found` };
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.hash);
    if (!isPasswordMatch) {
      console.error('Incorrect password');
      return { error: 'Invalid phone number or password' };
    }

    const { role, sub } = existingUser;

    let token = jwt.sign({ id: sub, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      sameSite: 'lax',
      path: '/',
    });

    console.log('User logged in successfully:', phone);
    return { status: 200 };
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

export async function preSignup(state, formData) {
  const schema = Joi.object({
    password: Joi.string().min(6).trim().required(),
    phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
  });

  try {
    const { value, error } = schema.validate({
      password: formData.get('password'),
      phone: formData.get('phone').toString(),
    });

    if (error) {
      console.error('Validation error:', error);
      return { error: `${error}` };
    }

    const { phone } = value;

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      console.error('User already exists');
      return { error: 'Invalid phone number or password' };
    }

    try {
      let form = new FormData();
      form.append('email', process.env.ESKIZ_EMAIL);
      form.append('password', process.env.ESKIZ_PASSWORD);

      const [eskizLoginResponse, codeToken] = await Promise.all([
        axios({
          method: 'post',
          url: `${process.env.ESKIZ_API}/auth/login`,
          headers: { ...form.getHeaders() },
          data: form,
        }),
        String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      ]);

      const token = eskizLoginResponse.data.data.token;

      form = new FormData();
      form.append('mobile_phone', `998${phone}`);
      form.append(
        'message',
        `Ваш код подтверждения для регистрации на сайте www.mimi.cyberlife.com: [${codeToken}]. Не сообщайте этот код другим лицам. Код действителен в течение 10 минут.`,
      );
      form.append('from', '4546');

      const smsResponse = axios({
        method: 'post',
        url: `${process.env.ESKIZ_API}/message/sms/send`,
        headers: {
          Authorization: `Bearer ${token}`,
          ...form.getHeaders(),
        },
        data: form,
      });

      client.set(phone, codeToken, 'EX', 10 * 60);

      return value;
    } catch (err) {
      console.error('Error sending SMS or logging in:', err);
      return { error: 'Error occurred while processing your request' };
    }
  } catch (err) {
    console.error('Error during validation or signup:', err);
    return { error: 'Internal server error' };
  }
}
