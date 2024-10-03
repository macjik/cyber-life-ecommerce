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

// ... [imports and initial setup]

export default async function CartPage({ params, searchParams }) {
  const { product } = params;
  const { id, invite } = searchParams;

  const currentUser = await User.findOne({ where: { sub: id } });

  if (!currentUser) {
    return <p>User not found!</p>;
  }

  const existingProduct = await Item.findOne({ where: { name: product } });

  if (!existingProduct) {
    return <p>Product not found!</p>;
  }

  let totalParticipants = 1; // Start with the inviter

  if (invite) {
    const existingInvite = await Invite.findOne({
      where: { inviteCode: invite },
      include: [
        { model: User, as: 'Inviter' },
        { model: User, as: 'Invitee' },
      ],
    });

    const isNotInviterOrInvitee =
      existingInvite?.Invitee.id !== currentUser.id &&
      existingInvite?.Inviter.id !== currentUser.id;

    if (!existingInvite || isNotInviterOrInvitee) {
      return (
        <main className="flex w-full h-full justify-center">
          <h1>Expired or Invalid Invite Link</h1>
        </main>
      );
    }

    // If the user is not the inviter and the invite is active
    if (existingInvite.inviter !== currentUser.id && existingInvite.status !== 'expired') {
      // Update the invite
      existingInvite.invitee = currentUser.id;
      existingInvite.status = 'expired';
      await existingInvite.save();
    }

    // Count total participants
    const invitersCount = await Invite.count({
      where: { inviter: existingInvite.inviter, status: 'expired' },
    });

    totalParticipants += invitersCount; // Add invitees count

    // Calculate discount
    const discountAmount = calculateDiscount(
      existingProduct.discount,
      existingProduct.price,
      totalParticipants,
    );
    const totalPrice = existingProduct.price - discountAmount;

    try {
      //findOne order if item id and user id matches
      let order = await Order.findOne({
        where: { userId: currentUser.id, itemId: existingProduct.id, status: 'pending' },
      });

      // Create order
      if (!order) {
        order = await Order.create({
          userId: currentUser.id,
          inviteId: existingInvite.id,
          itemId: existingProduct.id,
          discount: parseFloat(existingProduct.discount),
          totalAmount: parseFloat(totalPrice),
          totalBuyers: totalParticipants,
          status: 'pending',
        });
      } else {
        // Update the existing order
        order.discount = parseFloat(existingProduct.discount);
        order.totalAmount = parseFloat(totalPrice);
        order.totalBuyers = totalParticipants;
        await order.save();
      }
      return (
        <Product productName={product}>
          <div>Participants: {totalParticipants}</div>
          <div>Discount: {discountAmount}</div>
          <div>Total Price: {totalPrice}</div>
          <Link href={`/pay?orderId=${order.id}`}>
            <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
              Pay
            </Button>
          </Link>
          {existingProduct && (
            <InviteLinkGenerator
              category={existingProduct.category}
              product={product}
              inviterId={currentUser.id}
            >
              Share with your friends and get a discount
            </InviteLinkGenerator>
          )}
        </Product>
      );
    } catch (err) {
      console.error(err);
    }
  }

  // Handle the inviter's view (no invite code)
  const existingInvite = await Invite.findOne({
    where: { inviter: currentUser.id, status: 'pending' },
  });

  if (existingInvite) {
    const invitersCount = await Invite.count({
      where: { inviter: currentUser.id, status: 'expired' },
    });

    totalParticipants += invitersCount;

    const discountAmount = calculateDiscount(
      existingProduct.discount,
      existingProduct.price,
      totalParticipants,
    );
    const totalPrice = existingProduct.price - discountAmount;

    return (
      <Product productName={product}>
        <div>Participants: {totalParticipants}</div>
        <div>Discount: {discountAmount}</div>
        <div>Total Price: {totalPrice}</div>
        <Link href={`/pay?userId=${currentUser.id}&product=${product}`}>
          <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
            Pay
          </Button>
        </Link>
        <InviteLinkGenerator
          category={existingProduct.category}
          product={product}
          inviterId={currentUser.id}
        >
          Share with your friends and get a discount
        </InviteLinkGenerator>
      </Product>
    );
  }

  // Default view for a user without an invite
  return (
    <Product productName={product}>
      <div>No discount available.</div>
      <div>Price: {existingProduct.price}</div>
      <Link href={`/pay?userId=${currentUser.id}&product=${product}`}>
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Pay
        </Button>
      </Link>
      <InviteLinkGenerator
        category={existingProduct.category}
        product={product}
        inviterId={currentUser.id}
      >
        Share with your friends and get a discount
      </InviteLinkGenerator>
    </Product>
  );
}
