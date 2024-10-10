import Button from '@/app/Components/button';
import Product from '@/app/Components/product';
import db from '@/models/index';
import Link from '@/node_modules/next/link';

db.sequelize.sync();
const { item: Item } = db;

export default async function ItemPage({ params, searchParams }) {
  const { product } = params;
  const { invite } = searchParams;
  console.log(invite);

  let existingItem = await Item.findOne({ where: { name: product } });

  if (!existingItem) {
    return <p>Product Not Found!</p>;
  }

  const { name, description, image, quantity, category, price, status } = existingItem;

  return (
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
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Add to Cart
        </Button>
      </Link>
    </Product>
  );
}
