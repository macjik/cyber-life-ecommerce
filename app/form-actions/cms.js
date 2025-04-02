'use server';
import db from '@/models/index';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import { revalidatePath } from '@/node_modules/next/cache';
import client from '../services/redis';
// import { generateAuthorizationHeader } from '../helper/wechat-auth';

const { item: Item, Category, Item_Attribute, Company } = db;

export async function addContent(state, formData) {
  try {
    const company = formData.get('company');
    const imageFile = formData.getAll('image');
    const imageMimeType = imageFile.map((file) => file.type);
    console.log(imageMimeType);
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      description: Joi.string().min(5).required(),
      image: Joi.array()
        .items(Joi.string().valid('image/jpeg', 'image/png', 'image/webp').required())
        .min(1)
        .required(),
      price: Joi.number().required(),
      category: Joi.string().required(),
      discount: Joi.number().max(100).required(),
      quantity: Joi.number().required(),
      attributeName: Joi.string().allow(null, ''),
      attributeValue: Joi.array().items(Joi.string().allow(null, '')),
      ikpu: Joi.string().pattern(/^\d+$/).length(17).required(),
      packageCode: Joi.string().max(20).required(),
      shop: Joi.string().optional(),
    });

    const { value, error } = schema.validate({
      name: formData.get('title').replace(/\s+/g, '-'),
      description: formData.get('description'),
      image: imageMimeType,
      price: formData.get('price'),
      category: formData.get('category').replace(/\s+/g, '-'),
      discount: formData.get('discount'),
      quantity: formData.get('quantity'),
      attributeName: formData.get('attribute-name'),
      attributeValue: formData.getAll('attribute-value'),
      ikpu: formData.get('category-ikpu'),
      packageCode: formData.get('package-code'),
      shop: company,
    });

    if (error) {
      return { error: `${error.message}` };
    }

    const {
      name,
      description,
      price,
      category,
      discount,
      quantity,
      attributeValue,
      attributeName,
      ikpu,
      packageCode,
      shop,
    } = value;

    let existingItem = await Item.findOne({ where: { name } });
    if (existingItem) {
      return { error: `Item: ${name} exists` };
    }

    const uid = uuidv4();

    if (imageFile.length > 0) {
      const imageUrls = await Promise.all(
        imageFile.map(async (file, index) => {
          const imageArrayBuffer = await file.arrayBuffer();
          const imageBuffer = Buffer.from(imageArrayBuffer);
          const extension = file.type.split('/')[1];
          const imageFileName = `${uid}-${index}.${extension}`;

          const blob = await put(imageFileName, imageBuffer, {
            contentType: file.type,
            access: 'public',
          });

          return blob.url;
        }),
      );

      console.log(imageUrls);

      let [newCategory, created] = await Category.findOrCreate({
        where: { name: category },
        defaults: { name: category },
      });

      console.log(Array.isArray(imageUrls));
      console.log(typeof imageUrls[0]);

      let item = await Item.create({
        name,
        description,
        quantity,
        price,
        image: imageUrls.map((image) => String(image)),
        categoryId: newCategory.id,
        sku: uid,
        discount,
        ikpu: ikpu,
        packageCode: packageCode,
        companyId: company ? company : null,
      });

      if (attributeValue) {
        for (let i = 0; i < attributeValue.length; i++) {
          await Item_Attribute.create({
            name: attributeName,
            value: attributeValue[i],
            type: 'select',
            itemId: item.id,
          });
        }
      }

      revalidatePath('/admin');
      revalidatePath('/shop-cms');
      return { status: 200, value };
    } else {
      return { error: 'No image file found' };
    }
  } catch (err) {
    console.error(err);
    return { error: `${err.message}` };
  }
}

export async function deleteContent(state, formData) {
  const contentId = formData.get('id');

  try {
    let item = await Item.findOne({ where: { sku: contentId } });
    if (!item) {
      console.error('Item not found');
      return { error: 'Item not found' };
    }

    await Item_Attribute.destroy({ where: { itemId: item.id } });
    await Item.destroy({ where: { sku: contentId } });

    revalidatePath('/admin');
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
    attributeName: Joi.string().allow(null, ''),
    attributeValue: Joi.array().items(Joi.string().allow(null, '')),
    ikpu: Joi.string().pattern(/^\d+$/).length(17).required(),
    packageCode: Joi.string().max(20).required(),
  });

  const { value, error } = schema.validate({
    name: formData.get('title').replace(/\s+/g, '-'),
    description: formData.get('description'),
    image: imageMimeType,
    price: formData.get('price'),
    category: formData.get('category').replace(/\s+/g, '-'),
    discount: formData.get('discount'),
    quantity: formData.get('quantity'),
    id: formData.get('id'),
    attributeName: formData.get('attribute-name'),
    attributeValue: formData.getAll('attribute-value'),
    ikpu: formData.get('category-ikpu'),
    packageCode: formData.get('package-code'),
  });

  if (error) {
    console.error(error);
    return { error: `${error.message}` };
  }

  try {
    const {
      id,
      name,
      description,
      price,
      category,
      discount,
      quantity,
      attributeValue,
      attributeName,
      ikpu,
      packageCode,
    } = value;

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
      ikpu: ikpu,
      packageCode: packageCode,
    });

    if (!updatedItem) {
      console.error('Error updating item');
      return { error: 'Error updating item' };
    }

    const hasEmptyAttributes =
      !attributeName || attributeValue.some((val) => !val || val.trim() === '');

    if (hasEmptyAttributes) {
      await Item_Attribute.destroy({
        where: {
          itemId: existingItem.id,
        },
      });
    } else {
      for (let i = 0; i < attributeValue.length; i++) {
        await Item_Attribute.findOrCreate({
          where: {
            name: attributeName,
            value: attributeValue[i],
            itemId: updatedItem.id,
          },
          defaults: {
            type: 'select',
          },
        });
      }
    }

    revalidatePath('/admin');
    return { status: 200, value };
  } catch (err) {
    console.error(err);
    return { error: `${err.message}` };
  }
}

export async function deleteCompany(state, formData) {
  const companyId = formData.get('id');

  try {
    let company = await Company.findOne({ where: { id: companyId } });

    if (!company) {
      const errorMessage = { error: `Company with ID ${companyId} does not exist!` };
      console.error(errorMessage);
      return { status: 404, message: errorMessage };
    }

    let items = await Item.findAll({ where: { companyId: companyId } });

    if (items && items.length > 0) {
      await Promise.all(
        items.map(async (item) => {
          await Item_Attribute.destroy({ where: { itemId: item.id } });
        }),
      );

      await Promise.all(items.map((item) => item.destroy()));
    }

    await company.destroy();

    revalidatePath('/companies');

    return { status: 200, message: 'Company and associated items deleted successfully' };
  } catch (err) {
    console.error('Error:', err.message);
    return { status: 500, message: JSON.stringify(err) };
  }
}

export async function editCompany(state, formData) {
  const imageFile = formData.get('image');
  const imageMimeType = imageFile ? imageFile.type : null;

  try {
    const schema = Joi.object({
      id: Joi.any().required(),
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      slogan: Joi.string().allow(''),
      logo: Joi.string().valid('image/jpg', 'image/jpeg', 'image/png').allow(null),
    });

    const { value, error } = schema.validate({
      id: formData.get('id'),
      name: formData.get('name'),
      description: formData.get('description'),
      slogan: formData.get('slogan'),
      logo: imageMimeType,
    });

    if (error) {
      console.error('Validation Error:', error);
      return { status: 400, error: `Validation Error: ${error.message}` };
    }

    const { id, name, description, slogan, logo } = value;

    let company = await Company.findOne({ where: { id } });

    if (!company) {
      console.error('Company not found');
      return { status: 404, error: 'Company not found' };
    }

    let imageUrl = company.logo;

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

    await company.update({
      name,
      description,
      slogan,
      logo: imageUrl,
    });

    return { status: 200, message: 'Company updated successfully' };
  } catch (err) {
    console.error('Error updating company:', err);
    return { status: 500, error: `Internal Server Error: ${err.message}` };
  }
}

export async function setRate(state, formData) {
  try {
    const schema = Joi.object({ rate: Joi.string().max(5).required() });
    const { value, error } = schema.validate({ rate: formData.get('exchange-rate').toString() });

    if (error) {
      console.error(error);
      return { error: `${error}` };
    }

    let cacheExchangeRate = await client.set('exchange-rate', parseInt(value.rate, 10));

    if (cacheExchangeRate) {
      revalidatePath('/admin');
      return { status: 200 };
    } else {
      return { error: 'Error' };
    }
  } catch (err) {
    console.error(err);
    return { status: 500 };
  }
}
