'use client';

import Product from '@/app/Components/product';
import { usePathname } from 'next/navigation';

export default function ProductPath() {
  const path = usePathname();
  let productName = path.match(/^(?:[^\/]*\/){2}([^\/]*)/);
  productName = productName && productName[1];

  return <Product productName={productName} />;
}
