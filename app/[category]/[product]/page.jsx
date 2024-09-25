import Button from '@/app/Components/button';
import Product from '@/app/Components/product';
import Link from '@/node_modules/next/link';

export default async function ItemPage({ params }) {
  const { product } = params;
  return (
    <Product productName={product}>
      <Link href={`/cart/${product}`}>
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Add to Cart
        </Button>
      </Link>
    </Product>
  );
}
