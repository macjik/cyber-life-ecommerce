import db from '@/models/index';
import { v4 as uuidv4 } from 'uuid';
import calculateDiscount from '@/app/helper/calculate-discount';
import { fetchRelatedOrders, updateRelatedOrders } from '@/app/cart/[product]/page';

const { User, item: Item, Invite, Order } = db;

describe('CartPage Server and DB Interaction Tests', () => {
  beforeAll(async () => {
    const users = [
      { name: 'fake', phone: '1234567890', hash: 'password', sub: 'user-fake-1' },
      { name: 'fake', phone: '2234567890', hash: 'password', sub: 'user-fake-2' },
      { name: 'fake', phone: '3234567890', hash: 'password', sub: 'user-fake-3' },
      { name: 'fake', phone: '4234567890', hash: 'password', sub: 'user-fake-4' },
      { name: 'fake', phone: '5234567890', hash: 'password', sub: 'user-fake-5' },
      { name: 'fake', phone: '5234567891', hash: 'password', sub: 'user-fake-6' },
      { name: 'unrelated user', phone: '5234367891', hash: 'password', sub: 'bruv' },

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

    const transaction = await db.sequelize.transaction();

    try {
      const firstUser = users[0];
      const selfInvite = await Invite.create(
        {
          inviter: firstUser.id,
          invitee: firstUser.id,
          inviteCode: uuidv4(),
          status: 'expired',
        },
        { transaction },
      );

      const [firstOrder, firstOrderCreated] = await Order.findOrCreate({
        where: {
          itemId: existingProduct.id,
          userId: firstUser.id,
          status: 'pending',
        },
        defaults: {
          inviteId: selfInvite.id,
          discount: 0,
          totalBuyers: 1,
          totalAmount: parseInt(existingProduct.price, 10),
        },
        transaction,
      });

      expect(firstOrder).toBeDefined();
      if (firstOrderCreated) {
        expect(firstOrder.status).toBe('pending');
        expect(firstOrder.inviteId).toBe(selfInvite.id);
      }

      let allRelatedOrders = [firstOrder];

      for (let i = 1; i < users.length; i++) {
        const inviter = users[i - 1];
        const invitee = users[i];

        let invite = await Invite.create(
          {
            inviter: inviter.id,
            inviteCode: uuidv4(),
            status: 'pending',
          },
          { transaction },
        );

        invite.invitee = invitee.id;
        invite.status = 'expired';
        await invite.save({ transaction });

        // Create a new order for the invitee
        let newOrder = await Order.create(
          {
            userId: invitee.id,
            inviteId: invite.id,
            itemId: existingProduct.id,
            discount: 0, // Initial discount
            totalAmount: parseInt(existingProduct.price, 10),
            totalBuyers: 1, // Placeholder, will update later
            status: 'pending',
          },
          { transaction },
        );

        expect(newOrder).toBeDefined();

        // Add the new order to the chain
        allRelatedOrders.push(newOrder);

        // Recalculate total buyers (unique orders)
        const updatedTotalBuyers = allRelatedOrders.length;

        // Recalculate discount
        const discountAmount = calculateDiscount(
          parseInt(existingProduct.discount, 10),
          parseInt(existingProduct.price, 10),
          updatedTotalBuyers,
        );

        // Update all related orders
        await updateRelatedOrders(
          allRelatedOrders,
          updatedTotalBuyers,
          discountAmount,
          transaction,
        );
      }

      // Final validation
      const finalOrders = await Order.findAll({ where: { itemId: existingProduct.id } });
      console.log('Final Orders:', finalOrders);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }, 30000);

  afterAll(async () => {
    await db.sequelize.close();
  });
});
