import db from '@/models/index';
import { cookies } from 'next/headers';
db.sequelize.sync();
const Item = db.item;

export default async function ProductPage() {
  const cookieStore = cookies();
  const currentPath = cookieStore.get('currentPath')?.value || '';

  let productId = currentPath.match(/^(?:[^\/]*\/){3}([^\/]*)/);
  productId = productId ? productId[1] : null;

  let item = null;

  try {
    item = await Item.findOne({ where: { sku: productId } });
    console.log(item);
  } catch (err) {
    console.error(err);
  }

  return <>{JSON.stringify(item)}</>;
}
