'use server';

import LifeModal from '@/app/Components/life-modal';
import CardWrapper from '../wrapper';

export default async function ProvidersPage({ searchParams }) {
  const { service, id } = searchParams;

  const services = [
    { image: '/provider/SOLA.png', route: '/mobile?service=sola' },
    { image: '/provider/nano_telecom.png', route: '/mobile?service=nano_telecom' },
    { image: '/provider/gsm.png', route: '/mobile?service=gsm' },
    { image: '/provider/gals-telecom.png', route: '/mobile?service=gals-telecom' },
    { image: '/provider/freelink.png', route: '/mobile?service=freelink' },
    { image: '/provider/comnet.png', route: '/mobile?service=comnet' },
    { image: '/provider/City_Net.png', route: '/mobile?service=city_net' },
  ];
  return (
    <main className="p-8 w-full min-h-screen flex flex-col items-center">
      <section className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Internet Providers:</h1>
        <p className="text-xl font-normal text-gray-600">Select operator you want to pay for:</p>
      </section>
      {service ? <LifeModal placeholder="Login number"/> : <CardWrapper>{services}</CardWrapper>}
    </main>
  );
}
