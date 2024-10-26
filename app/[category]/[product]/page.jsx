import Button from '@/app/Components/button';
import Loading from '@/app/Components/loading';
import Product from '@/app/Components/product';
import db from '@/models/index';
import Link from '@/node_modules/next/link';
import { Suspense } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import {getTranslations} from 'next-intl/server';

const { item: Item } = db;

export default async function ItemPage({ params, searchParams }) {
  const { product } = params;
  const { invite } = searchParams;
  const t = await getTranslations();

  let existingItem = await Item.findOne({ where: { name: product } });

  if (!existingItem) {
    return <p>{t('error.product')}</p>;
  }

  const { name, description, image, quantity, category, price, status } = existingItem;

  return (
    <Suspense fallback={<Loading />}>
      <Product
        itemName={name}
        itemDescription={description}
        itemCategory={category}
        itemPrice={price}
        itemQuantity={quantity}
        itemSrc={image}
        itemStatus={status}
      >
        <Link href={`/cart/${product}${invite ? `?invite=${invite}` : ''}`}>
          <Button className="bg-blue-600 text-white text-xl hover:bg-blue-500 transition duration-300 ease-in-out inline-flex items-center justify-center gap-4 rounded-lg">
            {t('add-cart')}
            <FaShoppingCart size={24} className="text-right" />
          </Button>
        </Link>
      </Product>
    </Suspense>
  );
}
