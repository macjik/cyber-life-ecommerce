import Product from '@/app/Components/product';

export default async function ItemPage({ params }) {
  const { product } = params;
  return <Product productName={product} />;
}
