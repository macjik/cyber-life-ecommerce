import Link from '@/node_modules/next/link';
import CardWrapper from './wrapper';

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
        <CardWrapper>{services}</CardWrapper>
    </main>
  );
}
