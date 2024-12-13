'use server';

import db from '@/models/index';
import Dashboard from '../Components/content-dashboard';
import SetCurrency from '../Components/set-currency';
import client from '../services/redis';

const { item: Item, Category, Item_Attribute } = db;

export default async function AdminPanel({ searchParams }) {
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
      'ikpu',
      'packageCode',
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

  const { id, exchange_rate } = searchParams;
  const currentRate = await client.get('exchange-rate');

  if (exchange_rate) {
    return <SetCurrency currentRate={currentRate || 0} />;
  }

  return (
    <main className="w-full min-h-screen">
      <Dashboard>{formattedItems}</Dashboard>
    </main>
  );
}
