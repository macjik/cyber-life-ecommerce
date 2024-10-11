'use server';

import db from '@/models/index';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

db.sequelize.sync();
const {item:Item, Category} = db;

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
      console.error(error);
      return { error: `${error.message}` };
    }

    const { name, description, price, image, category, discount, quantity } = value;

    let existingItem = await Item.findOne({ where: { name } });
    if (existingItem) {
      return { error: `Item: ${name} exists` };
    }

    const uid = uuidv4();
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (imageFile) {
      const imageFileName = `${name}${imageFile.name}`;
      const imagePath = path.join(uploadDir, imageFileName);

      // Create a stream to save the file
      const stream = fs.createWriteStream(imagePath);
      const imageArrayBuffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      stream.write(imageBuffer);
      stream.end();

      let [newCategory, created] = await Category.findOrCreate({
        where: { name: category }, 
        defaults: { name: category }, 
      });
      
      await Item.create({
        name,
        description,
        quantity,
        price,
        image: `/uploads/${imageFileName}`,
        categoryId: newCategory.id,
        sku: uid,
        discount,
      });
      
    } else {
      console.error('No image file found.');
      return { error: 'No image file found' };
    }

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

    if (imageFile) {
      const uploadDir = path.join(process.cwd(), 'public/uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const imageFileName = `${name}${path.extname(imageFile.name)}`;
      const imagePath = path.join(uploadDir, imageFileName);

      const imageArrayBuffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      await fs.promises.writeFile(imagePath, imageBuffer);

      if (existingItem.image) {
        const oldImagePath = path.join(process.cwd(), 'public', existingItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      existingItem.image = `/uploads/${imageFileName}`;
    }

    let categoryRecord = await Category.findOne({ where: { name: category } });

    if (categoryRecord) {
      await Category.update({ name: category }, { where: { id: categoryRecord.id } });    
      let updateItem = await existingItem.update({
        name,
        description,
        price,
        categoryId: categoryRecord.id,
        discount,
        quantity,
        image: existingItem.image,
      });
    
      if (!updateItem) {
        console.error('Error updating item');
        return { error: 'Error updating item' };
      }
    
      return { status: 200, value };
    } else {
      let newCategory = await Category.create({ name: category });
    
      let updateItem = await existingItem.update({
        name,
        description,
        price,
        categoryId: newCategory.id,
        discount,
        quantity,
        image: existingItem.image,
      });
    
      if (!updateItem) {
        console.error('Error updating item');
        return { error: 'Error updating item' };
      }
    
      return { status: 200, value };
    }    
  } catch (err) {
    console.error(err);
    return { error: `${err}` };
  }
}
