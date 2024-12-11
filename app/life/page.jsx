import Link from '@/node_modules/next/link';
import CardWrapper from './wrapper';

export default async function LifePage({ searchParams }) {
  const { id } = searchParams;

  const services = [
    { image: '/mobile/mobile.png', route: '/mobile' },
    { image: '/visa/e_visa.png', route: '/e-visa' },
    { image: '/fine/fine.png', route: '/fines' },
    { image: '/provider/wifi.png', route: '/provider' },
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
