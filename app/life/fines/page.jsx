'use server';

import LifeModal from '@/app/Components/life-modal';
import CardWrapper from '../wrapper';

export default async function FinesPage({ searchParams }) {
  const { id, service } = searchParams;

  const operators = [{ image: '/fine/fine.png', route: '/fines?service=gubdd' }];

  return (
    <main className="p-8 w-full min-h-screen flex flex-col items-center">
      <section className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Fines:</h1>
        <p className="text-xl font-normal text-gray-600">Select fine you want to pay for:</p>
      </section>
      {service ? <LifeModal placeholder="Fine Number" /> : <CardWrapper>{operators}</CardWrapper>}
    </main>
  );
}
