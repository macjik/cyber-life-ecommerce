'use server';

import Image from '@/node_modules/next/image';
import Link from '@/node_modules/next/link';

export default async function CardWrapper({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
      {children.map((service, index) => (
        <Link href={`/life${service.route}`} key={index} className="group">
          <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
            <Image
              src={service.image}
              alt={`Service ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-48 object-contain transform transition duration-300 group-hover:scale-105"
              style={{ objectFit: 'contain' }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 transition duration-300 group-hover:opacity-100"></div>
          </div>
        </Link>
      ))}
    </div>
  );
}
