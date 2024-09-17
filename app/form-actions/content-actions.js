'use server';

import Joi from 'joi';

export async function addContent(state, formData) {
  try {
    const imageFile = formData.get('image');
    const imageMimeType = imageFile ? imageFile.type : null;

    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      description: Joi.string().min(5).required(),
      image: Joi.string().valid('image/jpg', 'image/jpeg', 'image/png').required(),
      price: Joi.number().required(),
      category: Joi.string().required(),
      discount: Joi.number().max(100).required(),
    });

    const { value, error } = schema.validate({
      title: formData.get('title'),
      description: formData.get('description'),
      image: imageMimeType,
      price: formData.get('price'),
      category: formData.get('category'),
      discount: formData.get('discount'),
    });

    if (error) {
      console.error(error);
      return { error: `${error.message}` };
    }

    const { title, description, image, price, category, discount } = value;
    console.log(title, description, image, price, category, discount);

    return {status: 200, value};
  } catch (err) {
    console.error(err);
    return { error: `${err.message}` };
  }
}
