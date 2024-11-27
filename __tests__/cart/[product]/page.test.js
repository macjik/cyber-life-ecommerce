import db from '@/models/index';
import { v4 as uuidv4 } from 'uuid';
import calculateDiscount from '@/app/helper/calculate-discount';
// import trackInviteChain from '@/app/helper/track-invites';
import { fetchRelatedOrders } from '@/app/cart/[product]/page';

const { User, item: Item, Invite, Order } = db;

describe('CartPage Server and DB Interaction Tests', () => {
  beforeAll(async () => {
    const users = [
      { name: 'fake', phone: '1234567890', hash: 'password', sub: 'user-fake-1' },
      { name: 'fake', phone: '2234567890', hash: 'password', sub: 'user-fake-2' },
      { name: 'fake', phone: '3234567890', hash: 'password', sub: 'user-fake-3' },
      { name: 'fake', phone: '4234567890', hash: 'password', sub: 'user-fake-4' },
      { name: 'fake', phone: '5234567890', hash: 'password', sub: 'user-fake-5' },
    ];
    await Promise.all(
      users.map(async (user) => {
        await User.findOrCreate({
          where: { phone: user.phone },
          defaults: user,
        });
      }),
    );

    await Item.findOrCreate({
      where: { id: 100 },
      defaults: {
        name: 'fake-item',
        description: 'This is a fake item',
        quantity: 80,
        price: 50_000,
        sku: 'fake-item-sku',
        discount: 15,
      },
    });
  });

  it('Should handle user invite and order processing in sequence', async () => {
    const users = await User.findAll({ where: { name: 'fake' } });
    const existingProduct = await Item.findOne({ where: { id: 100 } });

    for (let i = 0; i < users.length - 1; i++) {
      const inviter = users[i];
      const invitee = users[i + 1];

      const [createdOrder, orderCreated] = await Order.findOrCreate({
        where: {
          itemId: existingProduct.id,
          userId: inviter.id,
          status: 'pending',
        },
        defaults: {
          discount: 0,
          totalBuyers: 1,
          totalAmount: parseInt(existingProduct.price, 10),
        },
      });

      expect(createdOrder).toBeDefined();
      if (orderCreated) {
        expect(createdOrder.status).toBe('pending');
      }

      let invite = await Invite.create({
        inviter: inviter.id,
        inviteCode: uuidv4(),
        status: 'pending',
      });

      invite.invitee = invitee.id;
      invite.status = 'expired';
      await invite.save();

      createdOrder.inviteId = invite.id;
      await createdOrder.save();

      let newOrder = await Order.create({
        userId: invitee.id,
        inviteId: invite.id,
        itemId: existingProduct.id,
        discount: createdOrder.discount,
        totalAmount: createdOrder.totalAmount,
        totalBuyers: createdOrder.totalBuyers + 1,
        status: 'pending',
      });

      expect(newOrder).toBeDefined();

      let allRelatedOrders = await fetchRelatedOrders(existingProduct.id, invite.id);

      allRelatedOrders.push(newOrder);

      const maxTotalBuyers = Math.max(...allRelatedOrders.map((order) => order.totalBuyers));
      const updatedTotalBuyers = maxTotalBuyers;

      const discountAmount = calculateDiscount(
        parseInt(existingProduct.discount, 10),
        parseInt(existingProduct.price, 10),
        updatedTotalBuyers,
      );

      await updateRelatedOrders(allRelatedOrders, updatedTotalBuyers, discountAmount);
    }
  }, 30000);
  afterAll(async () => {
    await db.sequelize.close();
  });
});


async function updateRelatedOrders(orders, totalBuyers, discountAmount, originalPrice) {
  const updates = orders.map((order) => {
    order.totalBuyers = totalBuyers;
    order.discount = Math.round(discountAmount);
    order.totalAmount = Math.round(discountAmount);
    return order.save();
  });

  await Promise.all(updates);
}
