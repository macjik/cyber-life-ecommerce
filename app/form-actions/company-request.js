'use server';

import db from '@/models/index';
import axios from '@/node_modules/axios/index';
import Joi from '@/node_modules/joi/lib/index';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import client from '../services/redis';

const { User } = db;

export async function registerShop(state, formData) {
  try {
    const imageFile = formData.get('image');
    const imageMimeType = imageFile ? imageFile.type : null;

    const joi = Joi.object({
      name: Joi.string().max(15).required(),
      description: Joi.string().min(10).required(),
      slogan: Joi.string().max(15).required(),
      logo: Joi.string().valid('image/jpg', 'image/jpeg', 'image/png').required(),
      user: Joi.any().required(),
    });

    const { value, error } = joi.validate({
      name: formData.get('name'),
      description: formData.get('description'),
      slogan: formData.get('slogan'),
      logo: imageMimeType,
      user: formData.get('user'),
    });

    if (error) {
      return `Error: ${error}`;
    }

    const { name, description, slogan, logo, user } = value;

    const uid = uuidv4();

    if (imageFile) {
      const imageArrayBuffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      const imageFileName = `${uid}.${imageMimeType.split('/')[1]}`;

      const blob = await put(imageFileName, imageBuffer, {
        contentType: imageMimeType,
        access: 'public',
      });

      const imageUrl = blob.url;

      let owner = await User.findOne({ where: { sub: user } });

      let cacheCompany = await client.set(
        user,
        JSON.stringify({ name: name, description: description, slogan: slogan, logo: imageUrl }),
        'EX',
        604800,
      );
      //   let createShop = await Company.create({
      //     name: name,
      //     description: description,
      //     slogan: slogan,
      //     logo: imageUrl,
      //   });

      //   console.log(createShop);

      //send a request

      if (cacheCompany) {
        let res = await axios.post(`${process.env.BOT_SERVER}/shop`, value, {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });

        if (res.status === 200) {
          return { status: 200 };
        } else {
          return { status: 500 };
        }
      } else {
        return 'Error';
      }
    }
  } catch (err) {
    console.error(err);
  }
}
