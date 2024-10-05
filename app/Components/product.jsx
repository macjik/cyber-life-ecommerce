'use server';

// import db from '@/models/index';
import Image from 'next/image';

// db.sequelize.sync();
// const Item = db.item;

export default async function Product({
  itemName,
  itemDescription,
  itemSrc,
  itemCategory,
  itemPrice,
  itemStatus,
  itemQuantity,
  children,
}) {
  // let item = null;

  // try {
  //   item = await Item.findOne({ where: { name: productName } });
  //   console.log(item);
  // } catch (err) {
  //   console.error(err);
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl mb-6">
        <div className="relative h-56 w-full">
          <Image
            src={itemSrc || '/turtle.jpg'}
            alt={itemName}
            fill
            priority
            quality={100}
            sizes="80vw"
            style={{ objectFit: 'cover' }}
            className="object-contain rounded-t-lg"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{itemName || 'Product Name'}</h2>
          <p className="text-gray-600 mb-4">
            {itemDescription ||
              'Product description goes here. It provides details about the product.'}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-800">${itemPrice}</span>
            {/* <span className="text-gray-500 line-through text-lg">
              ${(parseFloat(item?.price) + parseFloat(item?.discount || 0)).toFixed(2)}
            </span> */}
          </div>
          <p className="text-gray-500 mb-4">Available Quantity: {itemQuantity}</p>
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Category: {itemCategory || 'Category'}</p>
          </div>
          <div className="mb-4 space-x-11">
            <span
              className={`inline-block px-4 py-2 rounded-full text-white ${
                itemStatus === 'available' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {itemStatus || 'Status'}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
