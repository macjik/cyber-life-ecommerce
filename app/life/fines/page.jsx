'use server';

import LifeModal from '@/app/Components/life-modal';
import CardWrapper from '../wrapper';

export default async function FinesPage({ searchParams }) {
  const { id, service } = searchParams;

  const operators = [{ image: '/fine/fine.png', route: '/fines?service=gubdd' }];

  if (service) {
    return <LifeModal placeholder="Fine Number" />;
  }

  return (
    <>
      <main className="p-8 w-full flex flex-col">
        <section className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Fines:</h1>
          <p className="text-xl font-normal text-gray-600">Select fine you want to pay for:</p>
        </section>
        <CardWrapper>{operators}</CardWrapper>
      </main>
      {/* {service ? <LifeModal placeholder="Fine Number" /> : <CardWrapper>{operators}</CardWrapper>} */}
    </>
  );
}
