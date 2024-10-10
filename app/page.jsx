'use server';

import db from '@/models/index';
import Image from '@/node_modules/next/image';
import Link from '@/node_modules/next/link';

db.sequelize.sync();
const { item: Item } = db;

export default async function Home() {
  let items;

  try {
    items = await Item.findAll({
      attributes: [
        'name',
        'description',
        'quantity',
        'image',
        'category',
        'status',
        'discount',
        'createdAt',
        'price',
      ],
    });
  } catch (err) {
    console.error(err);
  }

  return (
    <main className="w-full flex flex-col items-center pt-4 pb-20 space-y-12">
      <section className="w-max-w h-1/3 flex flex-col justify-center items-center text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-900">Mimi: Buy Together, Save More</h1>
        <p className="text-lg text-gray-700">
          Enjoy unbeatable discounts when you purchase with your friends and community.
        </p>
      </section>

      <section className="w-max-w flex flex-col justify-center items-center space-y-8">
        <h2 className="text-3xl font-semibold text-gray-800">Featured Deals</h2>
        <div className="flex justify-center space-x-6">
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={index}
                className="border max-w-xs p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <Image
                  priority
                  quality={100}
                  layout="responsive"
                  width={100}
                  height={100}
                  className="object-cover rounded-t-lg w-full"
                  src={item.image}
                  alt={`${item.name} image`}
                />
                <h3 className="font-bold text-2xl text-gray-900 mt-4 mb-2">{item.name}</h3>
                <p className="text-gray-700 text-base mb-2">{item.description}</p>
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  ${item.price}{' '}
                  {item.discount > 0 && <span className="text-green-600">(-{item.discount}%)</span>}
                </p>
                <Link href={`${item.category}/${item.name}`}>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full transition-colors duration-300 ease-in-out">
                    Join Group & Save
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-700">No featured deals available at the moment.</p>
          )}
        </div>
      </section>
      <section className="w-max-w h-max-h flex flex-col justify-center items-center text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">How It Works</h2>
        <ol className="no-markers text-left ms-24 list-decimal space-y-2 text-lg text-gray-700">
          <li>Select your desired product.</li>
          <li>Invite friends or join an existing group.</li>
          <li>Save big when the group completes the order!</li>
        </ol>
      </section>

      {/* Testimonials Section
      <section className="w-full h-1/4 flex flex-col justify-center items-center text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">What Our Users Say</h2>
        <blockquote className="italic text-lg text-gray-700">
          {'Mimi helped me save a lot on groceries with my neighbors!'}
        </blockquote>
        <p className="text-base text-gray-600">- Shavkat, Tashkent</p>
      </section>

      {/* Invite Friends Section 
      <section className="w-full h-1/4 flex flex-col justify-center items-center text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">Invite Friends and Earn Rewards</h2>
        <p className="text-lg text-gray-700">
          Share the app with your friends and get even more discounts!
        </p>
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 mt-4 transition-colors duration-300 ease-in-out">
          Invite Now
        </button>
      </section> */}
    </main>
  );
}
