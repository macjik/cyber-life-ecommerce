'use server';

import ShopForm from '../Components/shop-form';

export default async function Shop({ searchParams }) {
  return <ShopForm user={searchParams.id} />;
}
