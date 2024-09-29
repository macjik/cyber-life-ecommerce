import Link from '@/node_modules/next/link';
import Product from '../../Components/product';
import Button from '../../Components/button';
import CopyButtonLink from '@/app/Components/copy-button-link';
import db from '@/models/index';

db.sequelize.sync();

const User = db.User;
const Item = db.item;
const Invite = db.Invite;

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
  }

  let inviteLink = await Invite.create({ inviter: user.id });

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
