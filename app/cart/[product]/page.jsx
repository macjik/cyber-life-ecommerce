'use server';

import Link from '@/node_modules/next/link';
import Product from '../../Components/product';
import Button from '../../Components/button';
import CopyButtonLink from '@/app/Components/copy-button-link';

export default async function CartPage({ params, searchParams }) {
  const { product } = params;
  const { id } = searchParams;
  //get user id

  console.log('cart page params' + JSON.stringify(params));
  return (
    <Product productName={product}>
      <Link href={`/`}>
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Pay
        </Button>
      </Link>
      <CopyButtonLink item={`/invite?=`} className="mt-2">
        Share the link and buy it cheaper
      </CopyButtonLink>
    </Product>
  );
}
