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

db.sequelize.sync();
const User = db.User;

export async function signup(state, formData) {
  const schema = Joi.object({
    // name: Joi.string().min(2).trim().required(),
    password: Joi.string().min(6).trim().required(),
    phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
    inviteCode: Joi.string().allow(''),
    sms: Joi.number().min(4).required(),
  });

  try {
    const { value, error } = schema.validate({
      // name: formData.get('name'),
      password: formData.get('password'),
      phone: formData.get('phone').toString(),
      sms: formData.get('sms-confirm'),
    });

    if (error) {
      console.error('Validation error:', error);
      return { error: `${error}` };
    }

    // handle and check if the user name exists prior
    // if joi returns an error state in the frontend should output the validation

    //TODO: sms confirmation here

    const { name, password, phone, inviteCode, sms } = value;

    const hashedPassword = await bcrypt.hash(password, 9);

    let exisitingUser = await User.findOne({ where: { phone } });

    if (exisitingUser) {
      console.error(`A user with phone:${phone} already exists`);
      return { error: `Sorry, a user with phone: ${phone} already exists` };
    }

    const uid = uuidv4();

    await User.create({
      // name: name,
      hash: hashedPassword,
      role: 'user',
      phone: phone,
      sub: uid,
    });

    let token = jwt.sign({ id: uid, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      sameSite: 'lax',
      path: '/',
    });

    //TODO: sms confirmations
    console.log('User logged in successfully:', phone);

    console.log('User created successfully:', value);
    return { status: 200, phone: phone };
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

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

    let existingUser = await User.findOne({ where: { phone } });
    if (!existingUser) {
      console.error('User not found');
      return { error: `User not found` };
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.hash);
    if (!isPasswordMatch) {
      console.error('Incorrect password');
      return { error: 'Incorrect password' };
    }

    const { role, sub } = existingUser;

    let token = jwt.sign({ id: sub, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      sameSite: 'lax',
      path: '/',
    });

    console.log('User logged in successfully:', phone);
    return { status: 200, phone: phone };
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

export async function preLogin(state, formData) {
  const schema = Joi.object({
    // name: Joi.string().min(2).trim().required(),
    // password: Joi.string().min(6).trim().required(),
    phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
  });

  try {
    const { value, error } = schema.validate({
      // name: formData.get('name'),
      // password: formData.get('password'),
      phone: formData.get('phone').toString(),
    });

    if (error) {
      console.error('Validation error:', error);
      return { error: `${error}` };
    }

    const { name, password, phone } = value;

    let existingUser = await User.findOne({ where: { phone } });
    if (!existingUser) {
      console.error('User not found');
      return { error: `User not found` };
    } else {
      return { phone };
    }
  } catch (err) {
    console.error(err);
  }
}

export async function preSignup(state, formData) {
  const schema = Joi.object({
    // name: Joi.string().min(2).trim().required(),
    password: Joi.string().min(6).trim().required(),
    phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
  });

  try {
    const { value, error } = schema.validate({
      // name: formData.get('name'),
      password: formData.get('password'),
      phone: formData.get('phone').toString(),
    });

    if (error) {
      console.error('Validation error:', error);
      return { error: `${error}` };
    }

    const { phone } = value;

    let existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      console.error('User already exists');
      return { error: 'User already exists' };
    } else {
      try {
        let form = new FormData();
        form.append('email', process.env.ESKIZ_EMAIL);
        form.append('password', process.env.ESKIZ_PASSWORD);

        let { data } = await axios({
          method: 'post',
          url: `${process.env.ESKIZ_API}/auth/login`,
          headers: { ...form.getHeaders() },
          data: form,
        });

        let token = data.data.token;

        // if (token) {
        //   console.log(token);
        //   return new Response(JSON.stringify(token));
        // }

        const codeToken = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        form = new FormData();
        form.append('mobile_phone', `998${phone}`);
        form.append(
          'message',
          `Ваш код подтверждения для регистрации на сайте www.mimi.cyberlife.com: [${codeToken}]. Не сообщайте этот код другим лицам. Код действителен в течение 10 минут.`,
        );
        form.append('from', '4546');
        let { res } = await axios({
          method: 'post',
          url: `${process.env.ESKIZ_API}/message/sms/send`,
          headers: {
            Authorization: `Bearer ${token}`,
            ...form.getHeaders(),
          },
          data: form,
        });

        await client.set(phone, codeToken, 'EX', (MINUTE * 2) / 100);
        return value;
      } catch (err) {
        console.error(err);
        new Response(JSON.stringify(err));
      }
    }
  } catch (err) {
    console.error(err);
  }
}
