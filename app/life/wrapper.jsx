'use server';

import Image from 'next/image';
import Link from 'next/link';

export default async function CardWrapper({ children }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {children.map((service, index) => (
        <Link
          href={`/life${service.route}`}
          key={index}
          className="group flex flex-col sm:flex-row items-center gap-4 w-full"
        >
          <div className="relative overflow-hidden rounded-lg shadow-md bg-white p-4 flex-shrink-0">
            <Image
              src={service.image}
              alt={`Service ${index + 1}`}
              width={100}
              height={100}
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain transform transition duration-300 group-hover:scale-105"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col flex-grow text-center sm:text-left">
            <h2 className="text-lg font-semibold">Service {index + 1}</h2>
            <p className="text-base text-gray-600">
              Description or additional details here (adjust as needed).
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
