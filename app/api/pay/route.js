import 'server-only';
import db from '@/models/index';

db.sequelize.sync();
const { Payment } = db;

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    let existingPayment = await Payment.findOne({ where: { orderId: orderId } });

    if (!existingPayment) {
      existingPayment = await Payment.create({ orderId: orderId, status: 'pending' });
    }

    return new Response(JSON.stringify(existingPayment), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Error processing payment', { status: 500 });
  }
}
