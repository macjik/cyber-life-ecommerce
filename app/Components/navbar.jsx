'use server';

import Link from 'next/link';
import { FaUser, FaShoppingCart, FaHome } from 'react-icons/fa';
import { AiFillControl } from 'react-icons/ai';
import { getTranslations } from 'next-intl/server';
import Image from '@/node_modules/next/image';

export default async function NavBar({ userRole, isAllowedRoute, children, icon }) {
  if (!isAllowedRoute) return null;

  const t = await getTranslations();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      <Link
        href="/user"
        className="flex flex-col items-center text-black hover:text-gray-500 w-full"
      >
        <FaUser size={24} />
        <span className="text-xs">{t('user')}</span>
      </Link>
      <Link href="/" className="flex flex-col items-center text-black hover:text-gray-500 w-full">
        <Image
          src="/transparent-mimi-logo.png"
          alt="mimi logo"
          quality={50}
          width={50}
          height={100}
          className="object-contain"
        />
        {/* <FaHome size={24} /> */}
        <span className="text-xs">{t('home')}</span>
      </Link>
      <Link
        href="/my-cart"
        className="flex flex-col items-center text-black hover:text-gray-500 w-full"
      >
        <FaShoppingCart size={24} />
        <span className="text-xs">{t('cart')}</span>
      </Link>
      {userRole === 'admin' && (
        <Link
          href="/admin"
          className="flex flex-col items-center text-black hover:text-gray-500 w-full"
        >
          <AiFillControl size={24} />
          <span className="text-xs">Admin</span>
        </Link>
      )}

      {children && (
        <Link
          href={`/${children.toLowerCase()}`}
          className="flex flex-col items-center text-black hover:text-gray-500 w-full"
        >
          {icon}
          <span className="text-xs">{children}</span>
        </Link>
      )}
    </nav>
  );
}
