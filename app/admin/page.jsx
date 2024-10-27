'use server';

import db from '@/models/index';
import Dashboard from '../Components/content-dashboard';

const { item: Item, Category, Item_Attribute } = db;

export default async function AdminPanel() {
  const items = await Item.findAll({
    attributes: [
      'name',
      'description',
      'quantity',
      'image',
      'categoryId',
      'sku',
      'status',
      'discount',
      'createdAt',
      'price',
    ],
    include: [
      { model: Category, as: 'itemCategory', attributes: ['name'] },
      { model: Item_Attribute, as: 'itemAttributes', attributes: ['name', 'value', 'type'] },
    ],
  });

  const formattedItems = items.map((item) => {
    let base64Image = item.image
      ? `data:${item.image.mimetype};base64,${item.image.toString('base64')}`
      : null;
    return {
      ...item.dataValues,
      image: base64Image,
    };
  });

  return (
    <main className="w-full h-full">
      <Dashboard>{formattedItems}</Dashboard>
    </main>
  );
}
