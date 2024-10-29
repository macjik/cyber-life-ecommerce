import Product from '../../Components/product';
import db from '@/models/index';
import calculateDiscount from '@/app/helper/calculate-discount';
import InviteLinkGenerator from '@/app/Components/generate-invite';
import trackInviteChain from '@/app/helper/track-invites';
import PayButton from '@/app/Components/pay-button';
import { FaMoneyBill, FaPercent } from 'react-icons/fa';
import { Suspense } from 'react';
import Loading from '@/app/Components/loading';
import { getTranslations } from 'next-intl/server';

const { item: Item, User, Invite, Order, Category, Item_Attribute } = db;

export default async function CartPage({ params, searchParams }) {
  const { product } = params;
  const { id, invite } = searchParams;
  const t = await getTranslations();

  const currentUser = await User.findOne({ where: { sub: id } });
  if (!currentUser)
    return (
      <div className="min-h-screen w-full">
        <p>{t('user')}</p>
      </div>
    );

  const existingProduct = await Item.findOne({
    where: { name: product },
    include: [
      { model: Category, as: 'itemCategory', attributes: ['name'] },
      { model: Item_Attribute, as: 'itemAttributes', attributes: ['name', 'value'] },
    ],
  });
  if (!existingProduct)
    return (
      <div className="min-h-screen w-full">
        <p>{t('product')}</p>
      </div>
    );

  const currentOrder = await Order.findOne({
    where: { userId: currentUser.id, itemId: existingProduct.id },
    attributes: [
      'id',
      'userId',
      'itemId',
      'inviteId',
      'discount',
      'totalAmount',
      'totalBuyers',
      'status',
    ],
  });
  if (currentOrder) {
    return await renderOrderView(currentOrder, existingProduct, currentUser, product, invite);
  }

  if (invite) {
    return await handleInviteProcess(invite, existingProduct, currentUser, product);
  }

  const { name, description, image, category, price, status, quantity } = existingProduct;
  //ui update after price change
  let order = await Order.create({
    itemId: existingProduct.id,
    status: 'pending',
    userId: currentUser.id,
    discount: 0,
    totalBuyers: 1,
    totalAmount: parseInt(price, 10),
  });

  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Product
          itemName={name}
          itemDescription={description}
          itemSrc={image}
          itemCategory={existingProduct.itemCategory.name}
          itemPrice={price}
          itemStatus={status}
          itemQuantity={quantity}
          itemAttributes={
            existingProduct.itemAttributes &&
            existingProduct.itemAttributes.map((attr) => attr.value)
          }
          itemAttributeName={
            existingProduct.itemAttributes &&
            existingProduct.itemAttributes.map((attr) => attr.name)
          }
          orderId={order.id}
        >
          <div className="inline-flex w-full">
            <PayButton
              className="inline-flex justify-center text-center gap-4 max-h-max rounded-l"
              orderId={order.id}
            >
              {t('pay')} <FaMoneyBill size={22} />
            </PayButton>
            <InviteLinkGenerator
              category={existingProduct.itemCategory.name}
              product={product}
              inviterId={currentUser.id}
              className="gap-3 text-center border-2 rounded-r border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white p-0"
            >
              {t('link')}
            </InviteLinkGenerator>
          </div>
        </Product>
      </Suspense>
    </div>
  );
}

async function renderOrderView(currentOrder, existingProduct, currentUser, product, invite) {
  const discountAmount = calculateDiscount(
    existingProduct.discount,
    existingProduct.price,
    currentOrder.totalBuyers,
  );
  const totalPrice = existingProduct.price - discountAmount;
  let trackInvites = null;

  if (invite) {
    trackInvites = await handleInviteProcessing(invite, currentUser);
  }
  //ui update after price change
  const { name, description, image, category, price, status, quantity } = existingProduct;

  const t = await getTranslations();
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Product
          itemName={name}
          itemDescription={description}
          itemSrc={image}
          itemCategory={existingProduct.itemCategory.name}
          itemPrice={totalPrice}
          originalPrice={price}
          itemStatus={status}
          itemQuantity={quantity}
          itemAttributes={
            existingProduct.itemAttributes &&
            existingProduct.itemAttributes.map((attr) => attr.value)
          }
          itemAttributeName={
            existingProduct.itemAttributes &&
            existingProduct.itemAttributes.map((attr) => attr.name)[0]
          }
          orderId={currentOrder.id}
        >
          {/* <div>Participants: {currentOrder.totalBuyers}</div>
      <div>Discount: {discountAmount}</div> */}
          {/* <div>{trackInvites ? JSON.stringify(trackInvites) : <p>No Invites</p>}</div> */}
          <div className="inline-flex w-full">
            <PayButton
              className="inline-flex justify-center text-center gap-4 max-h-max rounded-l"
              orderId={currentOrder.id}
            >
              {t('pay')}
              <FaMoneyBill size={22} />
            </PayButton>
            <InviteLinkGenerator
              category={existingProduct.itemCategory.name}
              product={product}
              inviterId={currentUser.id}
              className="gap-3 text-center border-2 rounded-r border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white p-0"
            >
              {t('link')}
            </InviteLinkGenerator>
          </div>
        </Product>
      </Suspense>
    </div>
  );
}

async function handleInviteProcess(invite, existingProduct, currentUser, product) {
  const existingInvite = await Invite.findOne({
    where: { inviteCode: invite },
    include: [
      { model: User, as: 'Inviter' },
      { model: User, as: 'Invitee' },
    ],
  });

  const t = await getTranslations();

  if (
    !existingInvite ||
    (existingInvite.status === 'expired' && existingInvite.Invitee?.id !== currentUser.id)
  ) {
    return (
      <div className="min-h-screen">
        <main className="flex w-full h-full justify-center">
          <h1>{t('error.link')}</h1>
        </main>
      </div>
    );
  }

  if (existingInvite.inviter !== currentUser.id) {
    existingInvite.invitee = currentUser.id;
    existingInvite.status = 'expired';
    await existingInvite.save();
  }

  let inviterOrder = await getOrCreateOrder(
    existingInvite.Inviter.id,
    existingProduct,
    existingInvite.id,
  );
  const currentOrder = await createNewOrder(
    currentUser.id,
    existingInvite.id,
    existingProduct,
    inviterOrder,
  );

  const discountAmount = calculateDiscount(
    existingProduct.discount,
    existingProduct.price,
    inviterOrder.totalBuyers,
  );
  const totalPrice = existingProduct.price - discountAmount;

  const trackInvites = await trackInviteChain(existingInvite.inviter);

  const { name, description, image, category, price, status, quantity } = existingProduct;
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Product
          itemName={name}
          itemDescription={description}
          itemSrc={image}
          itemCategory={existingProduct.itemCategory.name}
          itemPrice={totalPrice}
          originalPrice={price}
          itemStatus={status}
          itemQuantity={quantity}
          itemAttributes={
            existingProduct.itemAttributes &&
            existingProduct.itemAttributes.map((attr) => attr.value)
          }
          itemAttributeName={
            existingProduct.itemAttributes &&
            existingProduct.itemAttributes.map((attr) => attr.name)[0]
          }
          orderId={currentOrder.id}
        >
          {/* <div>Participants: {JSON.stringify(currentOrder)}</div>
      <div>Discount: {discountAmount}</div>
      <div>Total Price: {totalPrice}</div>
      <div>Invite Chain: {JSON.stringify(trackInvites)}</div> */}
          {/* <{t('link')} href={`/pay?orderId=${currentOrder.id}`}>
        <Button className="bg-blue-400 text-xl hover:bg-blue-500 transition duration-300 ease-in-out">
          Pay
        </Button>
      </{t('link')}> */}
          <div className="inline-flex w-full">
            <PayButton
              className="inline-flex justify-center text-center gap-4 max-h-max rounded-l"
              orderId={currentOrder.id}
            >
              {t('pay')}
              <FaMoneyBill size={22} />
            </PayButton>
            <InviteLinkGenerator
              category={existingProduct.category}
              product={product}
              inviterId={currentUser.id}
              className="gap-3 text-center border-2 rounded-r border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white p-0"
            >
              {t('link')}
            </InviteLinkGenerator>
          </div>
        </Product>
      </Suspense>
    </div>
  );
}

async function getOrCreateOrder(inviterId, existingProduct, inviteId) {
  let inviterOrder = await Order.findOne({
    where: { userId: inviterId, itemId: existingProduct.id, status: 'pending' },
  });

  if (!inviterOrder) {
    const discountAmount = calculateDiscount(existingProduct.discount, existingProduct.price, 1);
    const totalPrice = existingProduct.price - discountAmount;

    inviterOrder = await Order.create({
      userId: inviterId,
      inviteId,
      itemId: existingProduct.id,
      discount: Math.floor(discountAmount),
      totalAmount: Math.floor(totalPrice),
      totalBuyers: 1,
      status: 'pending',
    });
  }

  inviterOrder.totalBuyers += 1;
  await inviterOrder.save();
  return inviterOrder;
}

async function createNewOrder(userId, inviteId, existingProduct, inviterOrder) {
  const discountAmount = calculateDiscount(
    existingProduct.discount,
    existingProduct.price,
    inviterOrder.totalBuyers,
  );
  const totalPrice = existingProduct.price - discountAmount;

  return await Order.create({
    userId,
    inviteId,
    itemId: existingProduct.id,
    discount: Math.round(discountAmount),
    totalAmount: Math.round(totalPrice),
    totalBuyers: inviterOrder.totalBuyers,
    status: 'pending',
  });
}

async function handleInviteProcessing(invite, currentUser) {
  const existingInvite = await Invite.findOne({ where: { inviteCode: invite } });
  if (
    existingInvite &&
    existingInvite.status !== 'expired' &&
    existingInvite.inviter !== currentUser.id
  ) {
    existingInvite.invitee = currentUser.id;
    existingInvite.status = 'expired';
    await existingInvite.save();
  }
  return await trackInviteChain(existingInvite.inviter);
}
