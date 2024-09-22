'use server';

import db from '@/models/index';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
db.sequelize.sync();
const Item = db.item;

export async function addContent(state, formData) {
  try {
    const imageFile = formData.get('image');
    const imageMimeType = imageFile ? imageFile.type : null;

    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      description: Joi.string().min(5).required(),
      image: Joi.string().valid('image/jpg', 'image/jpeg', 'image/png').required(),
      price: Joi.number().required(),
      category: Joi.string().required(),
      discount: Joi.number().max(100).required(),
      quantity: Joi.number().required(),
      // status: Joi.string().enum('available', 'out of stock', 'discontinued').required(),
    });

    const { value, error } = schema.validate({
      name: formData.get('title'),
      description: formData.get('description'),
      image: imageMimeType,
      price: formData.get('price'),
      category: formData.get('category'),
      discount: formData.get('discount'),
      quantity: formData.get('quantity'),
      // status: formData.get('status'),
    });

    if (error) {
      console.error(error);
      return { error: `${error.message}` };
    }

    const { name, description, image, price, category, discount, quantity } = value;

    let existingItem = await Item.findOne({ where: { name } });

    if (existingItem) {
      console.error(`Item: ${name} exists`);
      return { error: `Item: ${name} exists` };
    }

    const uid = uuidv4();

    await Item.create({
      name: name,
      description: description,
      quantity: quantity,
      price: price,
      image: image,
      category: category,
      sku: uid,
      // status: status,
      discount: discount,
    });

    return { status: 200, value };
  } catch (err) {
    console.error(err);
    return { error: `${err.message}` };
  }
}

export async function deleteContent(state, formData) {
  const contentId = formData.get('id');

  try {
    let item = await Item.destroy({ where: { sku: contentId } });

    if (!item) {
      console.error('Item not found');
      return { error: 'Item not found' };
    }
    return { status: 200, contentId };
  } catch (err) {
    console.error(err);
    return { error: `${err}` };
  }
}

export async function editContent(state, formData) {
  const imageFile = formData.get('image');
  const imageMimeType = imageFile ? imageFile.type : null;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    image: Joi.string().valid('image/jpg', 'image/jpeg', 'image/png').required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    discount: Joi.number().max(100).required(),
    quantity: Joi.number().required(),
    id: Joi.string().required(),
    // status: Joi.string().enum('available', 'out of stock', 'discontinued').required(),
  });

  const { value, error } = schema.validate({
    name: formData.get('title'),
    description: formData.get('description'),
    image: imageMimeType,
    price: formData.get('price'),
    category: formData.get('category'),
    discount: formData.get('discount'),
    quantity: formData.get('quantity'),
    id: formData.get('id'),
    // status: formData.get('status'),
  });

  if (error) {
    console.error(error);
    return { error: `${error.message}` };
  }

  try {
    const { id, name, description, image, price, category, discount, quantity } = value;
    let updateItem = await Item.update(
      { name, description, image, price, category, discount, quantity },
      { where: { sku: id }, limit: 1 },
    );

    if (!updateItem) {
      console.errror('Error to update');
      return { error: 'Error to update item' };
    }

    return { status: 200, value };
  } catch (err) {
    console.error(err);
    return { error: `${err}` };
  }
}
