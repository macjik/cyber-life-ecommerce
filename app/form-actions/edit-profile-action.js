'use server';

import db from '@/models/index';
import Joi from 'joi';

const User = db.User;

export async function editProfile(state, formData) {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(70).allow(null),
      image: Joi.any().allow(null),
      id: Joi.string().required(),
    });

    const { value, error } = schema.validate({
      name: formData.get('name'),
      image: formData.get('image'),
      id: formData.get('user-id'),
    });

    if (error) {
      console.error(error);
      return { error: `${error}` };
    }

    const { name, image, id } = value;

    await User.update({ name, image }, { where: { id } });

    return { status: 200 };
  } catch (err) {
    console.error(err);
  }
}
