'use server';
import db from '@/models/index';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import { revalidatePath } from '@/node_modules/next/cache';

const { item: Item, Category } = db;

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
    });

    const { value, error } = schema.validate({
      name: formData.get('title'),
      description: formData.get('description'),
      image: imageMimeType,
      price: formData.get('price'),
      category: formData.get('category'),
      discount: formData.get('discount'),
      quantity: formData.get('quantity'),
    });

    if (error) {
      return { error: `${error.message}` };
    }

    const { name, description, price, category, discount, quantity } = value;

    let existingItem = await Item.findOne({ where: { name } });
    if (existingItem) {
      return { error: `Item: ${name} exists` };
    }

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
      let [newCategory, created] = await Category.findOrCreate({
        where: { name: category },
        defaults: { name: category },
      });

      await Item.create({
        name,
        description,
        quantity,
        price,
        image: imageUrl,
        categoryId: newCategory.id,
        sku: uid,
        discount,
      });

      revalidatePath('/admin');
      return { status: 200, value };
    } else {
      return { error: 'No image file found' };
    }
  } catch (err) {
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

    revalidatePath('/admin')
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
  });

  if (error) {
    console.error(error);
    return { error: `${error.message}` };
  }

  try {
    const { id, name, description, price, category, discount, quantity } = value;

    const existingItem = await Item.findOne({ where: { sku: id } });
    if (!existingItem) {
      console.error('Item not found');
      return { error: 'Item not found' };
    }

    let imageUrl = existingItem.image;

    if (imageFile) {
      const imageArrayBuffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      const imageFileName = `${uuidv4()}.${imageMimeType.split('/')[1]}`;

      const blob = await put(imageFileName, imageBuffer, {
        contentType: imageMimeType,
        access: 'public',
      });

      imageUrl = blob.url;
    }

    let categoryRecord = await Category.findOne({ where: { name: category } });
    if (!categoryRecord) {
      categoryRecord = await Category.create({ name: category });
    }

    const updatedItem = await existingItem.update({
      name,
      description,
      price,
      categoryId: categoryRecord.id,
      discount,
      quantity,
      image: imageUrl,
    });

    if (!updatedItem) {
      console.error('Error updating item');
      return { error: 'Error updating item' };
    }

    revalidatePath('/admin')
    return { status: 200, value };
  } catch (err) {
    console.error(err);
    return { error: `${err.message}` };
  }
}
