import Product from '../../Components/product';
import db, { sequelize } from '@/models/index';
import calculateDiscount from '@/app/helper/calculate-discount';
import InviteLinkGenerator from '@/app/Components/generate-invite';
import trackInviteChain from '@/app/helper/track-invites';
import PayButton from '@/app/Components/pay-button';
import { FaMoneyBill, FaPercent } from 'react-icons/fa';
import { Suspense } from 'react';
import Loading from '@/app/Components/loading';
import { getTranslations } from 'next-intl/server';
import { v4 as uuidv4 } from 'uuid';

const { item: Item, User, Invite, Order, Category, Item_Attribute } = db;

export const revalidate = 0;

export default async function CartPage({ params, searchParams }) {
  const transaction = await sequelize.transaction();

  try {
    let { product } = params;
    let { id, invite } = searchParams;
    const t = await getTranslations();

    product = decodeURIComponent(product);

    const [currentUser, existingProduct] = await Promise.all([
      User.findOne({ where: { sub: id } }),
      Item.findOne({
        where: { name: product },
        include: [
          { model: Category, as: 'itemCategory', attributes: ['name'] },
          { model: Item_Attribute, as: 'itemAttributes', attributes: ['name', 'value'] },
        ],
      }),
    ]);

    if (!currentUser || !existingProduct) {
      await transaction.rollback();
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
      const result = await renderOrderView(
        currentOrder,
        existingProduct,
        currentUser,
        product,
        invite,
        transaction,
      );
      await transaction.commit();
      return result;
    }

    if (invite) {
      const result = await handleInviteProcess(
        invite,
        existingProduct,
        currentUser,
        product,
        transaction,
      );
      await transaction.commit();
      return result;
    }

    const { name, description, image, category, price, status, quantity } = existingProduct;
    let createInvite = await Invite.create({
      inviter: currentUser.id,
      invitee: currentUser.id,
      inviteCode: uuidv4(),
      status: 'expired',
    });

    let order = await Order.create(
      {
        itemId: existingProduct.id,
        status: 'pending',
        userId: currentUser.id,
        discount: 0,
        totalBuyers: 1,
        inviteId: createInvite.id,
        totalAmount: parseInt(price, 10),
      },
      { transaction },
    );

    await transaction.commit();

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
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function renderOrderView(
  currentOrder,
  existingProduct,
  currentUser,
  product,
  invite,
  transaction,
) {
  const t = await getTranslations();

  let trackInvites = null;
  if (invite) {
    trackInvites = await handleInviteProcessing(invite, currentUser, transaction);
  }

  const { name, description, image, category, price, status, quantity } = existingProduct;
  const { discount, totalAmount, totalBuyers } = currentOrder;

  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Product
          itemName={name}
          itemDescription={description}
          itemSrc={image}
          itemCategory={existingProduct.itemCategory.name}
          itemPrice={totalAmount}
          originalPrice={price}
          itemStatus={status}
          itemQuantity={quantity - totalBuyers}
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

async function handleInviteProcess(invite, existingProduct, currentUser, product, transaction) {
  const t = await getTranslations();

  const existingInvite = await Invite.findOne({
    where: { inviteCode: invite },
    include: [
      { model: User, as: 'Inviter' },
      { model: User, as: 'Invitee' },
    ],
  });

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
    await existingInvite.save({ transaction });
  }

  const allRelatedOrders = await fetchRelatedOrders(
    existingProduct.id,
    existingInvite.id,
    transaction,
  );

  let inviterOrder = await getOrCreateOrder(
    existingInvite.Inviter.id,
    existingProduct,
    existingInvite.id,
    transaction,
  );

  const currentOrder = await createNewOrder(
    currentUser.id,
    existingInvite.id,
    existingProduct,
    inviterOrder,
    transaction,
  );

  const discountAmount = calculateDiscount(
    existingProduct.discount,
    existingProduct.price,
    allRelatedOrders.length,
  );

  await updateRelatedOrders(
    allRelatedOrders,
    allRelatedOrders.length,
    discountAmount,
    transaction,
  );

  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Product
          itemName={existingProduct.name}
          itemDescription={existingProduct.description}
          itemSrc={existingProduct.image}
          itemCategory={existingProduct.itemCategory.name}
          itemPrice={currentOrder.totalAmount || existingProduct.price}
          originalPrice={existingProduct.price}
          itemStatus={existingProduct.status}
          itemQuantity={existingProduct.quantity - currentOrder.totalBuyers}
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
              product={existingProduct.name.replace(/\s+/g, '-')}
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

async function getOrCreateOrder(inviterId, existingProduct, inviteId, transaction) {
  let inviterOrder = await Order.findOne({
    where: { userId: inviterId, itemId: existingProduct.id, status: 'pending' },
    transaction,
  });

  if (!inviterOrder) {
    inviterOrder = await Order.create(
      {
        userId: inviterId,
        inviteId,
        itemId: existingProduct.id,
        discount: 0,
        totalAmount: existingProduct.price,
        totalBuyers: 1,
        status: 'pending',
      },
      { transaction },
    );
  }

  let allRelatedOrders = await fetchRelatedOrders(existingProduct.id, inviteId);

  allRelatedOrders.push(inviterOrder);

  const maxTotalBuyers = Math.max(...allRelatedOrders.map((order) => order.totalBuyers));
  const updatedTotalBuyers = maxTotalBuyers;

  const discountAmount = calculateDiscount(
    existingProduct.discount,
    existingProduct.price,
    updatedTotalBuyers,
  );

  await updateRelatedOrders(allRelatedOrders, updatedTotalBuyers, discountAmount, transaction);

  return inviterOrder;
}

export async function fetchRelatedOrders(itemId, rootInviteId) {
  const inviteChain = await trackInviteChain(rootInviteId);
  const inviteIds = inviteChain.map((invite) => invite.id);

  return await Order.findAll({
    where: {
      itemId: itemId,
      inviteId: inviteIds,
      status: 'pending',
    },
  });
}

export async function updateRelatedOrders(orders, totalBuyers, discountAmount, transaction) {
  const updates = orders.map((order) => {
    order.totalBuyers = totalBuyers;
    order.discount = Math.round(discountAmount);
    order.totalAmount = Math.round(discountAmount);
    return order.save({ transaction });
  });

  await Promise.all(updates);
}

async function createNewOrder(userId, inviteId, existingProduct, inviterOrder, transaction) {
  return await Order.create(
    {
      userId,
      inviteId,
      itemId: existingProduct.id,
      discount: inviterOrder.discount,
      totalAmount: inviterOrder.totalAmount,
      totalBuyers: inviterOrder.totalBuyers,
      status: 'pending',
    },
    { transaction },
  );
}

async function handleInviteProcessing(invite, currentUser, transaction) {
  const existingInvite = await Invite.findOne({ where: { inviteCode: invite }, transaction });
  if (
    existingInvite &&
    existingInvite.status !== 'expired' &&
    existingInvite.inviter !== currentUser.id
  ) {
    existingInvite.invitee = currentUser.id;
    existingInvite.status = 'expired';
    await existingInvite.save({ transaction });
  }
  return await trackInviteChain(existingInvite.inviter);
}
