'use server';

import db from '@/models/index';
import Dashboard from '../Components/content-dashboard';

db.sequelize.sync();
const Item = db.item;

export default async function AdminPanel() {
  const items = await Item.findAll({
    attributes: [
      'name',
      'description',
      'quantity',
      'image',
      'category',
      'sku',
      'status',
      'discount',
      'createdAt',
      'price',
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

  console.log(formattedItems);

  return (
    <main className="w-full h-full">
      <Dashboard>{formattedItems}</Dashboard>
    </main>
  );
}
