import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function MyProduct({
  key,
  itemName,
  itemDescription,
  itemSrc,
  itemCategory,
  itemPrice,
  itemDiscount,
  itemQuantity,
  children = null,
}) {
  let availabilityStatus;
  let statusColor;
  if (itemQuantity > 50) {
    availabilityStatus = 'available';
    statusColor = 'bg-green-500';
  } else if (itemQuantity > 0 && itemQuantity <= 50) {
    availabilityStatus = 'limited';
    statusColor = 'bg-yellow-500';
  } else {
    availabilityStatus = 'out of stock';
    statusColor = 'bg-red-500';
  }

  const statusBarWidth = `${Math.min((itemQuantity / 100) * 100, 100)}%`;
  const discountedPrice = itemDiscount ? (itemPrice * (1 - itemDiscount / 100)).toFixed(2) : null;

  const t = await getTranslations();

  return (
    <div
      key={key}
      className="flex flex-col md:flex-row items-stretch gap-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 w-full mb-4"
    >
      <Link
        href={`/${itemCategory}/${itemName}`}
        className="relative w-full h-40 sm:w-40 sm:h-40 md:w-36 md:h-36 flex-shrink-0"
      >
        <Image
          src={itemSrc[0] || '/turtle.jpg'}
          alt={itemName}
          fill
          priority
          quality={100}
          className="object-cover rounded-lg"
          sizes="(max-width: 640px) 100vw, 160px"
        />
        {itemDiscount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {itemDiscount}% {t('discount')}
          </span>
        )}
      </Link>
      <Link
        href={`/${itemCategory}/${itemName}`}
        className="flex-1 flex flex-col min-w-0 hover:underline-offset-2"
      >
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-lg font-bold text-gray-900 truncate hover:underline">
            {itemName || 'Product Name'}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {itemDescription || 'Short product description.'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-semibold text-gray-900">
              ${discountedPrice || itemPrice}
            </span>
            {itemDiscount && (
              <>
                <span className="text-sm line-through text-gray-400">${itemPrice}</span>
                <span className="text-xs font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  Save {itemDiscount}%
                </span>
              </>
            )}
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full self-start">
            {itemCategory || 'Category'}
          </span>
        </div>
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {availabilityStatus}
            </span>
            <span className="text-xs text-gray-500">{itemQuantity} units left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-full rounded-full ${statusColor}`}
              style={{ width: statusBarWidth }}
            ></div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 w-full sm:w-auto md:w-40 lg:w-48 justify-end">
        {children}
      </div>
    </div>
  );
}
