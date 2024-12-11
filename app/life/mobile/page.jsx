'use server';

import LifeModal from '@/app/Components/life-modal';
import CardWrapper from '../wrapper';

export default async function MobileOperatorsPage({ searchParams }) {
  const { id, operator } = searchParams;

  const operators = [
    { image: '/mobile/BeeLine_logo.png', route: '/mobile?operator=beeline' },
    { image: '/mobile/GSM.png', route: '/mobile?operator=gsm' },
    { image: '/mobile/Humans.png', route: '/mobile?operator=humans' },
    { image: '/mobile/Perfectum.png', route: '/mobile?operator=perfectum' },
    { image: '/mobile/usell.png', route: '/mobile?operator=usell' },
  ];

  return (
    <main className="p-8 w-full min-h-screen flex flex-col items-center">
      <section className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Mobile Operators:</h1>
        <p className="text-xl font-normal text-gray-600">Select operator you want to pay for:</p>
      </section>
      {operator ? <LifeModal /> : <CardWrapper>{operators}</CardWrapper>}
    </main>
  );
}
