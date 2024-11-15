import db from '@/models/index';
import { v4 as uuidv4 } from 'uuid';

const { User, item: Item, Invite, Order } = db;

describe('Check Orders', () => {
  beforeAll(async () => {
    try {
      const users = [
        { name: 'test', phone: '1234567890', hash: 'password', sub: 'user-test-1' },
        { name: 'test', phone: '2234567890', hash: 'password', sub: 'user-test-2' },
        { name: 'test', phone: '3234567890', hash: 'password', sub: 'user-test-3' },
        { name: 'test', phone: '4234567890', hash: 'password', sub: 'user-test-4' },
        { name: 'test', phone: '5234567890', hash: 'password', sub: 'user-test-5' },
        { name: 'test', phone: '6234567890', hash: 'password', sub: 'user-test-6' },
        { name: 'test', phone: '7234567890', hash: 'password', sub: 'user-test-7' },
        { name: 'test', phone: '8234567890', hash: 'password', sub: 'user-test-8' },
        { name: 'test', phone: '9234567890', hash: 'password', sub: 'user-test-9' },
        { name: 'test', phone: '0234567890', hash: 'password', sub: 'user-test-10' },
      ];
      await Promise.all(
        users.map(async (user) => {
          await User.findOrCreate({
            where: { phone: user.phone },
            defaults: user,
          });
        }),
      );
    } catch (err) {
      throw new Error(err);
    }
  });

  it('Should create or find and retrieve fake users', async () => {
    let users = await User.findAll({ where: { name: 'test' } });
    users = users.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      hash: user.hash,
      sub: user.sub,
    }));
    expect(users).toBeDefined();
  });

  it('Should create 1 order', async () => {
    let existingItem = await Item.findOne({ where: { id: 20 } });
    if (!existingItem) {
      throw new Error('No item found with the specified ID.');
    }

    let users = await User.findAll({ where: { name: 'test' } });
    if (!users || users.length === 0) {
      throw new Error('No users found with the specified name.');
    }

    let [createdOrder, created] = await Order.findOrCreate({
      where: {
        itemId: existingItem.id,
        status: 'pending',
        userId: users[0].id,
      },
      defaults: {
        discount: 0,
        totalBuyers: 1,
        totalAmount: parseInt(existingItem.price, 10),
      },
    });

    expect(createdOrder).toBeDefined();

    if (created) {
      console.log('A new order was created.');
      expect(created).toBe(true);
    } else {
      console.log('An existing order was found.');
      expect(created).toBe(false);
    }

    let invites = [];
    for (let i = users.length; users.length; i++) {
      const invite = await Invite.create({
        inviter: (users[i].id),
        inviteCode: uuidv4(),
        status: 'pending',
      });
      invites.push(invite);
    }
    expect(invites.length).toBeGreaterThanOrEqual(users.length);
  });
});
