'use server';

import LifeModal from '@/app/Components/life-modal';
import CardWrapper from '../wrapper';

export default async function MobileOperatorsPage({ searchParams }) {
  const { id, service } = searchParams;

  const operators = [
    { image: '/mobile/BeeLine_logo.png', route: '/mobile?service=beeline' },
    { image: '/mobile/GSM.png', route: '/mobile?service=gsm' },
    { image: '/mobile/Humans.png', route: '/mobile?service=humans' },
    { image: '/mobile/Perfectum.png', route: '/mobile?service=perfectum' },
    { image: '/mobile/usell.png', route: '/mobile?service=usell' },
    { image: '/mobile/mobiuz.png', route: '/mobile?service=mobiuz' },
  ];

  return (
    <main className="p-8 w-full min-h-screen flex flex-col items-center">
      <section className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Mobile Operators:</h1>
        <p className="text-xl font-normal text-gray-600">Select operator you want to pay for:</p>
      </section>
      {service ? <LifeModal placeholder="977777777" /> : <CardWrapper>{operators}</CardWrapper>}
    </main>
  );
}
