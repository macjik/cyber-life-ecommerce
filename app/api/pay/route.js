import 'server-only';
import db from '@/models/index';

const { Payment } = db;

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    const payment = await Payment.upsert(
      {
        orderId: orderId,
        status: 'pending',
      },
      { returning: true },
    );

    return new Response(JSON.stringify(payment), { status: 200 });
  } catch (err) {
    console.error('Error processing payment:', err);
    return new Response(
      JSON.stringify({ message: 'Error processing payment', error: err.message }),
      { status: 500 },
    );
  }
}
