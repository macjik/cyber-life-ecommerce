'use server';

import Link from '@/node_modules/next/link';
import Product from '../../Components/product';
import Button from '../../Components/button';

export default async function CartPage({ params }) {
  const { product } = params;

  return (
    <Product productName={product}>
      <Link href={`/`}>
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Pay
        </Button>
      </Link>
      <Link href={``}>
        <Button className="bg-blue-400 text-lg hover:bg-blue-500 transition duration-300 ease-in-out mt-3">
          Share the link and get a discount
        </Button>
      </Link>
    </Product>
  );
}
