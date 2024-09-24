'use server';

import db from '@/models/index';
import Image from 'next/image';
import Button from './button';

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
        <div className="relative h-72 w-full">
          <Image
            src={'/turtle.jpg'}
            alt={item?.name}
            fill
            priority
            quality={100}
            sizes="80vw"
            style={{ objectFit: 'cover' }}
            className="object-contain rounded-t-lg"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{item?.name || 'Product Name'}</h2>
          <p className="text-gray-600 mb-4">
            {item?.description ||
              'Product description goes here. It provides details about the product.'}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-800">${item?.price}</span>
            <span className="text-gray-500 line-through text-lg">
              ${(parseFloat(item?.price) + parseFloat(item?.discount || 0)).toFixed(2)}
            </span>
          </div>
          <p className="text-gray-500 mb-4">Available Quantity: {item?.quantity}</p>
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Category: {item?.category || 'Category'}</p>
          </div>
          <div className="mb-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-white ${
                item?.status === 'available' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {item?.status || 'Status'}
            </span>
          </div>
          <Button className='bg-blue-700'>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
