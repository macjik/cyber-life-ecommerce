'use server';

import Link from '@/node_modules/next/link';

export default async function LifePage({ searchParams }) {
  const { id } = searchParams;

  return (
    <main className="p-8 w-full h-screen flex justify-center">
      <section className="h-max">
        <h1 className="text-4xl font-bold text-center">Life</h1>
        <p className="text-xl font-normal">Select services you want to pay for:</p>
      </section>
    </main>
  );
}
