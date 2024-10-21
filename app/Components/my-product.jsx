import Image from 'next/image';

export default async function MyProduct({
  itemName,
  itemDescription,
  itemSrc,
  itemCategory,
  itemPrice,
  itemStatus,
  itemDiscount,
  children = null,
}) {
  return (
    <div className="flex items-center justify-start py-3 px-4 bg-white rounded-lg shadow-md w-full mb-4 hover:shadow-lg transition-shadow">
      <div className="relative w-32 h-32 mr-4">
        <Image
          src={itemSrc || '/turtle.jpg'}
          alt={itemName}
          fill
          priority
          quality={100}
          className="object-cover rounded-lg"
        />
        {itemDiscount && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {itemDiscount}% OFF
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center gap-6">
        <h2 className="text-xl font-bold text-gray-800">{itemName || 'Product Name'}</h2>
        <p className="text-gray-600 text-sm">{itemDescription || 'Short product description.'}</p>
        <div className="text-lg font-semibold text-gray-900">
          ${itemPrice}
          {itemDiscount && <span className="text-green-600 ml-2">(-{itemDiscount}%)</span>}
        </div>
        <p className="text-gray-500 text-sm">{itemCategory || 'Category'}</p>
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${
            itemStatus === 'available' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {itemStatus || 'Status'}
        </span>
      </div>
      {/* <div className='flex w-30 h-20 gap-2'>{children}</div> */}
    </div>
  );
}
