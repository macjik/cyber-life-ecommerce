'use server';

import Link from 'next/link';

export default async function SubNav({ link, children, faIcon }) {
  return (
    <Link href={link} target='_blank'>
      <section className="w-full h-20 p-3 bg-white shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gray-100 my-1 text-left cursor-pointer flex items-center">
        <div className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition-colors duration-300 flex items-center space-x-3 ms-12">
          <span>{children}</span>
          <span>{faIcon}</span>
        </div>
      </section>
    </Link>
  );
}
