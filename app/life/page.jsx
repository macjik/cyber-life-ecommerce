'use client';

import Link from '@/node_modules/next/link';

export default async function LifePage({ searchParams }) {
  const { id } = searchParams;

  const services = [
    { image: '/service1.jpg', route: '/mobile' },
    { image: '/service2.jpg', route: '/e-visa' },
    { image: '/service3.jpg', route: '/provider' },
    { image: '/service3.jpg', route: '/fines' }
  ];

  return (
    <main className="p-8 w-full min-h-screen flex flex-col items-center">
      <section className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Life</h1>
        <p className="text-xl font-normal text-gray-600">Select services you want to pay for:</p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {services.map((service, index) => (
          <Link href={`/life${service.route}`} key={index} className="group">
            <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
              <img
                src={service.image}
                alt={`Service ${index + 1}`}
                className="w-full h-48 object-cover transform transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 transition duration-300 group-hover:opacity-100"></div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
