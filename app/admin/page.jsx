'use server';

import Dashboard from '../Components/content-dashboard';

const items = [
  {
    id: 'adq313rdwaef-23ed',
    image: '/image.png',
    price: 32,
    description: 'very good osh',
    discount: 43,
    isAvailable: true,
    quantity: 3,
    title: 'Osh',
  },
  {
    id: 'adq313rdwaewf-23ed',
    image: '/image.png',
    price: 33,
    description: 'very bad osh',
    discount: 40,
    isAvailable: true,
    quantity: 3,
    title: 'Posh',
  },
];

export default async function AdminPanel() {
  return (
    <main className="w-full h-full">
      <Dashboard>{items}</Dashboard>
    </main>
  );
}
