'use server';

import { getTranslations } from 'next-intl/server';
import ImageSwiper from './swiper';
import Loading from './loading';
import { Suspense } from 'react';

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
  console.log(itemSrc);
  return (
    <div className="min-h-screen w-full mx-auto">
      <Suspense fallback={<Loading />}>
        <div className="w-full flex flex-col gap-6 md:gap-8 mt-10">
          <div className="w-full flex justify-center">
            <div className="relative w-full aspect-square">
              <ImageSwiper images={itemSrc} />
            </div>
          </div>
          <div className="w-full flex flex-col max-w-7xl p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{itemName}</h1>
            {itemCategory && <p className="text-gray-600 mb-4">{itemCategory}</p>}
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`text-2xl font-bold ${itemDiscount ? 'text-red-600' : 'text-gray-900'}`}
              >
                {itemDiscount || itemPrice} UZS
              </span>
              {itemDiscount && (
                <span className="text-lg text-gray-500 line-through">{itemPrice} UZS</span>
              )}
              {itemDiscount > 0 && !itemDiscount && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {t('discount')}
                </span>
              )}
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{itemDescription}</p>
              <p className="text-sm text-gray-500">
                {t('Admin.quantity')}: {itemQuantity}
              </p>
              <p
                className={`text-sm font-medium ${itemStatus === 'available' ? 'text-green-600' : 'text-red-600'}`}
              >
                {t(itemStatus)}
              </p>
            </div>
            {children}
          </div>
        </div>
      </Suspense>
    </div>
  );
}
