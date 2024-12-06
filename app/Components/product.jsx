'use server';

import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import ProductOptions from './product-options';

export default async function Product({
  itemName,
  itemDescription,
  itemSrc,
  itemCategory,
  itemPrice,
  itemStatus,
  itemQuantity,
  itemDiscount,
  orderId,
  itemAttributes = null,
  itemAttributeName = null,
  originalPrice = null,
  maxQuantity = 100,
  children = null,
}) {
  const t = await getTranslations('');
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 mb-6">
        <div className="relative h-56 w-full group">
          <Image
            src={itemSrc || '/turtle.jpg'}
            alt={itemName}
            fill
            priority
            quality={100}
            sizes="80vw"
            style={{ objectFit: 'cover' }}
            className="object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
          />
          {itemDiscount && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-full shadow-lg">
              {itemDiscount}% {t('discount')}
            </span>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{itemName || 'Product Name'}</h2>
          <p className="text-gray-600 mb-4">
            {itemDescription ||
              'Product description goes here. It provides details about the product.'}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                {itemPrice}UZS
              </span>
              {originalPrice && (
                <span className="text-gray-500 line-through text-lg ml-2">{originalPrice}</span>
              )}
            </div>
          </div>
          <div className="mb-4">
            {/* <p className="text-gray-500 text-sm mb-2">{t('category')}: {itemCategory || 'Category'}</p> */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${(itemQuantity / maxQuantity) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-500 text-sm">
              {t('available')}: {itemQuantity}/{maxQuantity}
            </p>
          </div>
          <div className="mb-4">
            <span
              className={`inline-block px-4 py-2 rounded-full text-white ${
                itemStatus === 'available' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {(itemStatus = t('available') || 'Status')}
            </span>
            <div className="my-5">
              {itemAttributeName && (
                <p className="inline-block px-4 py-2 bg-teal-500 text-white rounded-full font-bold">
                  {itemAttributeName}
                </p>
              )}
              {itemAttributes &&
                itemAttributes.map(
                  (attr, index) =>
                    attr &&
                    index && (
                      <ProductOptions key={index} orderId={orderId}>
                        {attr}
                      </ProductOptions>
                    ),
                )}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
