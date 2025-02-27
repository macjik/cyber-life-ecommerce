'use server';

import LifeModal from '@/app/Components/life-modal';
import CardWrapper from '../wrapper';
import VisaModal from '@/app/Components/visa-modal';

export default async function EVisaPage({ searchParams }) {
  const { service, id } = searchParams;

  const services = [{ image: '/visa/e_visa.png', route: '/e-visa?service=e_visa' }];

  return (
    <main className="p-8 w-full min-h-screen flex flex-col items-center">
      <section className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">E-visa services:</h1>
        <p className="text-xl font-normal text-gray-600">Select service you want to pay for:</p>
        <p className="text-xl font-normal text-gray-600">300,000 UZS</p>
      </section>
      {service ? <VisaModal /> : <CardWrapper>{services}</CardWrapper>}
    </main>
  );
}
