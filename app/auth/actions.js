'use server';

import 'dotenv';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';
import db from '@/models/index';
db.sequelize.sync();
const User = db.User;

export async function signup(state, formData) {
  const schema = Joi.object({
    // name: Joi.string().min(2).trim().required(),
    // password: Joi.string().min(6).trim().required(),
    phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
    inviteCode: Joi.string().allow(''),
    sms: Joi.number().min(4).required(),
  });

  try {
    const { value, error } = schema.validate({
      // name: formData.get('name'),
      // password: formData.get('password'),
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

    // const hashedPassword = await bcrypt.hash(password, 10);

    let exisitingUser = await User.findOne({ where: { phone } });

    if (exisitingUser) {
      console.error(`A user with phone:${phone} already exists`);
      return { error: `Sorry, a user with phone: ${phone} already exists` };
    }

    await User.create({
      // name: name,
      // hash: hashedPassword,
      role: 'user',
      phone: phone,
    });

    let token = jwt.sign({ phone: phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    // password: Joi.string().min(6).trim().required(),
    phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
    sms: Joi.number().min(4).required(),
  });

  try {
    const { value, error } = schema.validate({
      // name: formData.get('name'),
      // password: formData.get('password'),
      phone: formData.get('phone').toString(),
      sms: formData.get('sms-confirm'),
    });

    if (error) {
      console.error('Validation error:', error);
      return { error: `${error}` };
    }

    const { name, password, phone, sms } = value;

    let existingUser = await User.findOne({ where: { phone } });
    if (!existingUser) {
      console.error('User not found');
      return { error: `User not found` };
    }

    // const isPasswordMatch = await bcrypt.compare(password, existingUser.hash);
    // if (!isPasswordMatch) {
    //   console.error('Incorrect password');
    //   return { error: 'Incorrect password' };
    // }

    let token = jwt.sign({ phone: phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      sameSite: 'lax',
      path: '/',
    });

    //TODO: sms confirmations
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
    if (existingUser) {
      console.error('User not found');
      return { error: 'User already exists' };
    } else {
      return { phone };
    }
  } catch (err) {
    console.error(err);
  }
}
