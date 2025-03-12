'use server';

import Image from '@/node_modules/next/image';
import AuthForm from '../Components/toggle-form';

export default async function AuthPage() {
  return (
    <main className="bg-gradient-to-br from-gray-900 to-gray-700 w-full flex">
      <div className="max-w-xl h-full w-full bg-white shadow-lg p-8">
        <AuthForm />
      </div>
      <div className="w-full relative">
        <Image
          className="object-contain w-full h-full"
          src="/black-cat.webp"
          quality={100}
          width={120}
          height={120}
          alt="black cat"
          loading="lazy"
        />
      </div>
    </main>
  );
}
