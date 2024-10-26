import Image from 'next/image';
import {getTranslations} from 'next-intl/server';

export default async function MyProduct({
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
  if (itemQuantity > 50) {
    availabilityStatus = 'available';
  } else if (itemQuantity > 0 && itemQuantity <= 50) {
    availabilityStatus = 'limited';
  } else {
    availabilityStatus = 'out of stock';
  }

  const statusBarWidth = `${(itemQuantity / 100) * 100}%`;

  const t = await getTranslations();
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-4 px-4 sm:px-6 bg-white rounded-lg shadow-md w-full mb-6 hover:shadow-lg transition-shadow">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4 md:mb-0 md:mr-6">
        <Image
          src={itemSrc || '/turtle.jpg'}
          alt={itemName}
          fill
          priority
          quality={100}
          className="object-cover rounded-lg"
        />
        {itemDiscount && (
          <span className="absolute top-1 left-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {itemDiscount}% {t('discount')}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{itemName || 'Product Name'}</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {itemDescription || 'Short product description.'}
        </p>
        <div className="text-lg font-semibold text-gray-900">
          ${itemPrice}
          {itemDiscount && <span className="text-green-600 ml-2">(-{itemDiscount}%)</span>}
        </div>
        <p className="text-gray-500 text-sm sm:text-base">{itemCategory || 'Category'}</p>

        <div className="w-full sm:w-96 bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className={`h-full rounded-full ${
              availabilityStatus === 'available'
                ? 'bg-green-500'
                : availabilityStatus === 'limited'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: statusBarWidth }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700 mt-1">
          {availabilityStatus} ({itemQuantity} units left)
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 lg:w-96">{children}</div>
    </div>
  );
}
