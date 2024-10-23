'use server';

import db from '@/models/index';
import Joi from 'joi';
import { put } from '@vercel/blob';

const User = db.User;

export async function editProfile(state, formData) {
  try {
    const imageFile = formData.get('image');
    let imageMimeType = null;

    if (imageFile && imageFile.type !== 'application/octet-stream') {
      imageMimeType = imageFile.type;
    }

    const schema = Joi.object({
      name: Joi.string().min(2).max(70).allow(null),
      imageMimeType: Joi.string()
        .valid('image/jpg', 'image/jpeg', 'image/png')
        .allow(null)
        .optional(),
      id: Joi.string().required(),
    });

    const { value, error } = schema.validate({
      name: formData.get('name'),
      imageMimeType: imageMimeType || null,
      id: formData.get('user-id'),
    });

    if (error) {
      console.error(error);
      return { error: `${error}` };
    }

    const { name, id } = value;

    let imageUrl = null;
    if (imageFile && imageMimeType) {
      const imageArrayBuffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      const imageFileName = `${id}.${imageMimeType.split('/')[1]}`;

      const blob = await put(imageFileName, imageBuffer, {
        contentType: imageMimeType,
        access: 'public',
      });

      imageUrl = blob.url;
    }

    const updateData = { name };
    if (imageUrl !== null) {
      updateData.image = imageUrl;
    }

    await User.update(updateData, { where: { id } });

    return { status: 200, imageUrl };
  } catch (err) {
    console.error(err);
    return { error: 'An unexpected error occurred.' };
  }
}
