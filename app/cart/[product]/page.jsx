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
  let { product } = params;
  let { id, invite } = searchParams;
  const t = await getTranslations();

  product = decodeURIComponent(product);

const currentUser = await User.findOne({ where: { sub: id } });
const existingProduct = await Item.findOne({
  where: { name: product },
  include: [
    { model: Category, as: 'itemCategory', attributes: ['name'] },
    { model: Item_Attribute, as: 'itemAttributes', attributes: ['name', 'value'] },
  ],
});

if (!currentUser || !existingProduct) {
  return (
    <div className="min-h-screen w-full">
      <p>{!currentUser ? t('user') : t('product')}</p>
    </div>
  );
}


  if (!currentUser || !existingProduct) {
    return (
      <div className="min-h-screen w-full">
        <p>{!currentUser ? t('user') : t('product')}</p>
      </div>
    );
  }

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
          itemQuantity={quantity - 1}
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
              product={product.replace(/\s+/g, '-')}
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
  let discountAmount = 0;
  let totalPrice = existingProduct.price;

  if (currentOrder.totalBuyers > 1) {
    discountAmount = calculateDiscount(
      existingProduct.discount,
      existingProduct.price,
      currentOrder.totalBuyers,
    );
    totalPrice -= discountAmount;
  }

  let trackInvites = null;
  if (invite) {
    trackInvites = await handleInviteProcessing(invite, currentUser);
  }
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
          itemQuantity={quantity - currentOrder.totalBuyers}
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
              product={product.replace(/\s+/g, '-')}
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

async function handleInviteProcess(invite, existingProduct, currentUser) {
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

  const allRelatedOrders = await fetchRelatedOrders(existingProduct.id, existingInvite.id);

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
    allRelatedOrders.length + 1,
  );

  await updateRelatedOrders(
    allRelatedOrders,
    allRelatedOrders.length,
    discountAmount,
    existingProduct.price,
  );

  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>{/* Your Product component rendering code here */}</Suspense>
    </div>
  );
}

async function getOrCreateOrder(inviterId, existingProduct, inviteId) {
  let inviterOrder = await Order.findOne({
    where: { userId: inviterId, itemId: existingProduct.id, status: 'pending' },
  });

  if (!inviterOrder) {
    inviterOrder = await Order.create({
      userId: inviterId,
      inviteId,
      itemId: existingProduct.id,
      discount: 0,
      totalAmount: existingProduct.price,
      totalBuyers: 1,
      status: 'pending',
    });
  }

  let allRelatedOrders = await fetchRelatedOrders(existingProduct.id, inviteId);

  allRelatedOrders.push(inviterOrder);

  const maxTotalBuyers = Math.max(...allRelatedOrders.map((order) => order.totalBuyers));
  const updatedTotalBuyers = maxTotalBuyers + 1;

  const discountAmount = calculateDiscount(
    existingProduct.discount,
    existingProduct.price,
    updatedTotalBuyers,
  );

  await updateRelatedOrders(
    allRelatedOrders,
    updatedTotalBuyers,
    discountAmount,
    existingProduct.price,
  );

  return inviterOrder;
}

async function fetchRelatedOrders(itemId, rootInviteId) {
  const inviteChain = await trackInviteChain(rootInviteId);
  const inviteIds = inviteChain.map((invite) => invite.id);

  return await Order.findAll({
    where: {
      itemId,
      inviteId: inviteIds,
      status: 'pending',
    },
  });
}

async function updateRelatedOrders(orders, totalBuyers, discountAmount, originalPrice) {
  const updates = orders.map((order) => {
    order.totalBuyers = totalBuyers;
    order.discount = Math.round(discountAmount);
    order.totalAmount = Math.round(originalPrice - discountAmount);
    return order.save();
  });

  await Promise.all(updates);
}

async function createNewOrder(userId, inviteId, existingProduct, inviterOrder) {
  return await Order.create({
    userId,
    inviteId,
    itemId: existingProduct.id,
    discount: inviterOrder.discount,
    totalAmount: inviterOrder.totalAmount,
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
