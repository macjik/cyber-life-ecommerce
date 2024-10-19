'use server';

import db from '@/models/index';
import Joi from 'joi';

const User = db.User;

export async function editProfile(state, formData) {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(70).required(),
      address: Joi.string().required(),
      phone: Joi.string().length(9).pattern(/^\d+$/).trim().required(),
      //   profileImage: Joi.string()
      //     .pattern(/^[^<>:"/\\|?*\x00-\x1F]+$/)
      //     .pattern(/\.(jpg|png)$/i)
      //     .optional(),
      id: Joi.string().required(),
      smsCode: Joi.string().length(4).required(),
    });

    const { value, error } = schema.validate({
      name: formData.get('name'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      //   profileImage: formData.get('profile-image'),
      id: formData.get('user-id'),
      smsCode: formData.get('sms-code'),
    });

    if (error) {
      console.error(error);
      return { error: `${error}` };
    }

    const {
      name,
      address,
      phone,
      // profileImage,
      id,
    } = value;
    // console.log(id);

    console.log('Types of inputs:', {
      name: typeof name,
      address: typeof address,
      phone: typeof phone,
      id: typeof id,
      smsCode: typeof smsCode,
    });

    let user = await User.findOne({ where: { sub: id } });
    console.log(user);

    if (!user) {
      console.error('User not found');
      return { error: 'User not found' };
    }

    await user.update({
      name,
      address,
      phone,
      //   profileImage,
    });

    return { status: 200, value };
  } catch (err) {
    console.error(err);
  }
}
