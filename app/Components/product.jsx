'use server';

import db from '@/models/index';
import Image from '@/node_modules/next/image';

db.sequelize.sync();
const Item = db.item;

export default async function Product({ productName }) {
  let item = null;

  try {
    item = await Item.findOne({ where: { name: productName } });
    console.log(item);
  } catch (err) {
    console.error(err);
  }

  const imageData = item.image?.data
    ? `data:image/jpeg;base64,${Buffer.from(item.image.data).toString('base64')}`
    : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-56 w-full">
          <Image
            src="/turtle.jpg"
            alt={item?.name}
            fill
            priority
            quality={100}
            sizes="80vw"
            style={{ objectFit: 'cover' }}
            className="object-contain"
          />
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
          <p className="text-gray-600 mt-2">{item.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-700 font-bold text-lg">${item.price}</span>
            <span className="text-gray-500 line-through text-md">
              ${(parseFloat(item.price) + parseFloat(item.discount)).toFixed(2)}
            </span>
          </div>
          <p className="text-gray-500 mt-2">Available Quantity: {item.quantity}</p>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">SKU: {item.sku}</p>
            <p className="text-gray-500 text-sm">Category: {item.category}</p>
          </div>
          <div className="mt-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-white ${
                item.status === 'available' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
