'use server';

import joi from 'joi';
import db from '@/models/index';
import axios from '@/node_modules/axios/index';
import Joi from '@/node_modules/joi/lib/index';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import client from '../services/redis';
import { revalidate } from '../cart/[product]/page';
import { revalidatePath } from '@/node_modules/next/cache';

const { User, Payment } = db;

export async function invoiceReq(state, formData) {
  try {
    const joi = Joi.object({
      target: Joi.string().length(9).required(),
      amount: Joi.string().min(4).max(6).required(),
      id: Joi.string().required(),
      service: Joi.string().required(),
    });

    const { value, error } = joi.validate({
      target: formData.get('target').toString(),
      amount: formData.get('amount').toString(),
      id: formData.get('id'),
      service: formData.get('service'),
    });

    console.log(value);

    if (error) {
      console.error(error);
      return { error: JSON.stringify(error) };
    }

    let user = await User.findOne({ where: { sub: value.id } });

    if (!user) {
      console.error('User not found');
      return { error: 'User not found' };
    }

    value.from = user.phone;

    const amount = value.amount;

    // let res = await axios.get(
    //   `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/UZS`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Accept: 'application/json',
    //     },
    //   },
    // );

    // let res = await axios.post(`${process.env.BOT_SERVER}/pay`, value, {
    //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    // });

    revalidatePath('/life/mobile');

    let exchangedCurrency = await client.get('currency-rate');
    //res.data.conversion_rates.CNY;
    exchangedCurrency = parseInt(exchangedCurrency, 10) * amount * 1.02;
    console.log(exchangedCurrency);

    return { nigga: 'dd' };
    // if (res.status === 200) {
    //   return { status: 200 };
    // } else {
    //   return { status: 500 };
    // }
  } catch (err) {
    console.error(err);
    return { error: `${err}` };
  }
}
