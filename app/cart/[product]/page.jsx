import Link from '@/node_modules/next/link';
import Product from '../../Components/product';
import Button from '../../Components/button';
import db from '@/models/index';
import calculateDiscount from '@/app/helper/calculate-discount';
import InviteLinkGenerator from '@/app/Components/generate-invite';

db.sequelize.sync();

const User = db.User;
const Item = db.item;
const Invite = db.Invite;
const Order = db.Order;

//apply the discount on an item for both the inviter and invitee
//can't change the item's price, only shared item should have a discount

export default async function CartPage({ params, searchParams }) {
  const { product } = params;
  const { id, invite } = searchParams;

  let user = await User.findOne({
    where: { sub: id },
    include: [
      { model: Invite, as: 'InvitationsSent' },
      { model: Invite, as: 'InvitationsReceived' },
    ],
  });

  if (!user) {
    return <p>User not found!</p>;
  }

  let existingProduct = await Item.findOne({ where: { name: product } });

  if (invite) {
    let existingInvite = await Invite.findOne({
      where: { inviteCode: invite },
      include: [
        { model: User, as: 'Inviter' },
        { model: User, as: 'Invitee' },
      ],
    });

    if (existingInvite.status === 'expired' && existingInvite.Invitee.id !== user.id) {
      return (
        <main className="flex w-full h-full justify-center">
          <h1>Expired Link</h1>
        </main>
      );
    }

    if (
      existingInvite &&
      existingInvite.status !== 'expired' &&
      existingInvite.inviter !== user.id
    ) {
      existingInvite.invitee = user.id;
      existingInvite.status = 'expired';
      await existingInvite.save();
    }

    let sentInvites = await Invite.count({ where: { inviter: user.id, status: 'expired' } });
    let receivedInvites = await Invite.count({
      where: { invitee: existingInvite.invitee, status: 'expired' },
    });

    console.log('inviter/s sent' + sentInvites);
    console.log('invite/s received' + receivedInvites);

    const { discount, price } = existingProduct;

    let discountOnInvite = calculateDiscount(discount, price, receivedInvites);

    discountOnInvite = discountOnInvite.toFixed(1);
    console.log('discount\n\n\n' + discountOnInvite);
    // return <main>{discountOnInvite}</main>;

    let order = await Order.create({
      userId: user.id,
      itemId: existingProduct.id,
      discount: parseInt(existingProduct.discount, 10),
      totalAmount: parseInt(discountOnInvite, 10),
      totalBuyers: receivedInvites + sentInvites,
      status: 'pending',
    });
  }

  // let inviteLink = await Invite.create({ inviter: user.id });

  console.log('cart page params', JSON.stringify(params));

  return (
    <Product productName={product}>
      <Link href={`/`}>
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Pay
        </Button>
      </Link>
      {existingProduct && (
        <InviteLinkGenerator
          category={existingProduct.category}
          product={product}
          inviterId={user.id}
        >Share with your friends and get a discount</InviteLinkGenerator>
      )}
    </Product>
  );
}
