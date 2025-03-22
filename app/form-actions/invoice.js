'use server';

import db from '@/models/index';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import client from '../services/redis';
import { revalidatePath } from 'next/cache';
import { generateSign, generateWeChatPaySign } from '../helper/sign';

const { User, Payment } = db;

export async function invoiceReq(state, formData) {
  try {
    // Step 1: Validate Input
    const schema = require('joi').object({
      target: require('joi').string().length(9).required(),
      amount: require('joi').string().min(4).max(6).required(),
      id: require('joi').string().required(),
      service: require('joi').string().required(),
    });

    const { value, error } = schema.validate({
      target: formData.get('target').toString(),
      amount: formData.get('amount').toString(),
      id: formData.get('id'),
      service: formData.get('service'),
    });

    if (error) {
      console.error('Validation Error:', error);
      return { error: JSON.stringify(error.details) };
    }

    // Step 2: Fetch User
    const user = await User.findOne({ where: { sub: value.id } });
    if (!user) {
      return { error: 'User not found' };
    }

    value.from = user.phone;

    // Step 3: Calculate Exchanged Currency
    const exchangeRate = await client.get('exchange-rate');
    const exchangedCurrency = parseInt(value.amount, 10) / parseInt(exchangeRate, 10);
    console.log('Exchanged Currency:', exchangedCurrency);
    console.log('API Key:', `"${process.env.WECHAT_API_SECRET_KEY}"`);

    // Step 4: Prepare WeChat Pay Request
    const nonce_str = uuidv4().replace(/-/g, '');
    const out_trade_no = `ORDER${Date.now()}`;
    console.log(process.env.WECHAT_APP_ID);
    console.log(process.env.WECHAT_MERCHANT_ID);
    console.log(process.env.WECHAT_API_SECRET_KEY);
    const data = {
      appid: process.env.WECHAT_APP_ID, // App ID
      body: 'ProductPurchase',
      mch_id: process.env.WECHAT_MERCHANT_ID, // Merchant ID
      nonce_str: nonce_str,
      notify_url: 'https://yourserver.com/notify', // Notify URL
      out_trade_no: out_trade_no,
      // sign_type: 'HMAC-SHA256', // Signature Type
      spbill_create_ip: '45.9.230.164', // Terminal IP Address
      total_fee: 100, //parseInt(exchangedCurrency, 10), //Math.round(exchangedCurrency), // Amount in Fen
      fee_type: 'CNY',
      trade_type: 'MWEB', // Payment Type for H5
    };

    // Step 5: Generate Signature
    const sign = generateSign(data, process.env.WECHAT_API_SECRET_KEY);
    data.sign = sign;

    console.log('Generated Sign:', sign);
    console.log('notify_url ' + data.notify_url);

    // Step 6: Build XML Payload
    const xmlData = `
        <xml>
          <appid>${data.appid}</appid>
          <body>${data.body}</body>
          <fee_type>${data.fee_type}</fee_type>
          <mch_id>${data.mch_id}</mch_id>
          <nonce_str>${data.nonce_str}</nonce_str>
          <notify_url>${data.notify_url}</notify_url>
          <out_trade_no>${data.out_trade_no}</out_trade_no>
          <spbill_create_ip>${data.spbill_create_ip}</spbill_create_ip>
          <total_fee>${data.total_fee}</total_fee>
          <trade_type>${data.trade_type}</trade_type>
          <sign>${data.sign}</sign>
        </xml>
`;

    console.log('Request XML:', xmlData);

    // Step 7: Send Request to WeChat Pay
    const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', xmlData, {
      headers: { 'Content-Type': 'application/xml' },
    });

    console.log('WeChat Pay Response:', response.data);

    // Step 8: Revalidate Path and Return Success
    revalidatePath('/life');
    return { success: true, response: response.data };
  } catch (err) {
    console.error('Error:', err.message);
    return { error: `${err.message}` };
  }
}
