'use server';

import db from '@/models/index';
import Joi from 'joi';
import FormData from 'form-data';
import axios from 'axios';
import client from '../services/redis';
import { getTranslations } from 'next-intl/server';
import bcrypt from 'bcrypt';
import { t } from '@/node_modules/i18next/index';

const { User } = db;

export async function checkPhone(state, formData) {
  const schema = Joi.object({ phone: Joi.string().length(9).pattern(/^\d+$/).trim().required() });

  const t = await getTranslations();
  try {
    const { value, error } = schema.validate({
      phone: formData.get('phone').toString().replace(/\D/g, ''),
    });

    if (error) {
      return { error: `${error}` };
    }

    const { phone } = value;

    let user = await User.findOne({ where: { phone: phone } });

    if (!user) {
      return { error: t('Auth.no-user') };
    }

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

    const message = t('sms', { codeToken });

    form = new FormData();
    form.append('mobile_phone', `998${phone}`);
    form.append('message', message);
    form.append('from', '4546');

    await axios({
      method: 'post',
      url: `${process.env.ESKIZ_API}/message/sms/send`,
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
      data: form,
    });

    await client.set(phone, codeToken, 'EX', 10 * 60);

    return { phone: phone };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}

export async function confirmSmsCode(state, formData) {
  const smsCode = formData.get('sms-code');
  const phone = formData.get('phone');

  let clientSms = await client.get(phone.toString());

  if (clientSms == smsCode) {
    return { phone: phone };
  } else {
    return { error: t('Auth.wrong-code') };
  }
}

export async function changePassword(state, formData) {
  const phone = formData.get('phone');
  const password = formData.get('password');

  try {
    let user = await User.findOne({ where: { phone: phone } });

    if (!user) {
      return { status: 404, error: t('Auth.no-user') };
    }

    user.hash = await bcrypt.hash(password, 8);
    await user.save();
    return { status: 200 };
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}
