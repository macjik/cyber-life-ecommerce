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

  console.log(items);
  return (
    <main className="w-full h-full">
      <Dashboard>{items}</Dashboard>
    </main>
  );
}
