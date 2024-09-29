'use server';

import Link from '@/node_modules/next/link';
import Product from '../../Components/product';
import Button from '../../Components/button';
import CopyButtonLink from '@/app/Components/copy-button-link';
import db from '@/models/index';

// Sync the database models (optional; could be removed in production)
db.sequelize.sync();

// Access the models
const User = db.User;
const Item = db.item;
const Invite = db.Invite;

export default async function CartPage({ params, searchParams }) {
  const { product } = params;
  const { id } = searchParams;

  let user = await User.findOne({ where: { sub: id } });

  if (!user) {
    return <p>User not found!</p>;
  }

  // let inviteLink = await Invite.findOne({
  //   where: { inviter: user.id },
  //   order: [['createdAt', 'DESC']],
  // });

  // if (!inviteLink) {
  let inviteLink = await Invite.create({ inviter: user.id });
  //}

  let existingProduct = await Item.findOne({ where: { name: product } });

  console.log('cart page params', JSON.stringify(params));

  return (
    <Product productName={product}>
      <Link href={`/`}>
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Pay
        </Button>
      </Link>
      {existingProduct && (
        <CopyButtonLink
          item={`/${existingProduct.category}/${product}/?invite=${inviteLink.inviteCode}`}
          className="mt-2"
        >
          Share the link and buy it cheaper
        </CopyButtonLink>
      )}
    </Product>
  );
}
