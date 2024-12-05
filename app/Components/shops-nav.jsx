'use server';

import db from '@/models/index';
import Image from 'next/image';
import Link from 'next/link';

const { Company } = db;

export default async function ShopsNav() {
  const shops = await Company.findAll({
    attributes: ['id', 'name', 'logo'],
  });

  return (
    <nav className="w-full mt-3">
      <div className="flex justify-center items-center p-2 space-x-4 border-b border-gray-300">
        <Link href="/">
          <Image
            src="/transparent-mimi-logo.png"
            alt="mimi logo"
            quality={100}
            width={100}
            height={100}
            className="object-contain w-16 h-16"
          />
        </Link>
        {/* <h1 className="text-lg md:text-xl font-bold text-gray-800">SHOPS</h1> */}
      </div>

      <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-4 px-4 py-4 bg-gray-100">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/?shop=${shop.id}`}
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition duration-200"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={shop.logo || '/default-logo.png'}
                alt={shop.name}
                width={100}
                height={100}
                className="object-cover h-full w-full"
              />
            </div>
            <span className="text-xs mt-1 truncate w-full text-center">{shop.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
