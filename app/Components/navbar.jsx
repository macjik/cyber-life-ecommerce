'use server';

import Link from 'next/link';
import { FaUser, FaShoppingCart, FaHome, FaStarOfLife } from 'react-icons/fa';
import { AiFillControl } from 'react-icons/ai';
import { getTranslations } from 'next-intl/server';
import Image from '@/node_modules/next/image';
import Logo from '../../public/transparent-mimi-logo.webp';

export default async function NavBar({ userRole, isAllowedRoute, children, icon, locale }) {
  if (!isAllowedRoute) return null;

  const t = await getTranslations();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-17 z-50 shadow-lg">
      <div className="flex items-center mx-auto max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full py-2">
        <Link
          href="/user"
          className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
        >
          <FaUser size={24} />
          <span className="text-sm font-semibold">{t('user')}</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
        >
          <FaHome size={24} />
          <span className="text-sm font-semibold">{t('home')}</span>
        </Link>
        <Link
          href="/my-cart"
          className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
        >
          <FaShoppingCart size={24} />
          <span className="text-sm font-semibold">{t('cart')}</span>
        </Link>
        {userRole === 'admin' && (
          <Link
            href="/admin"
            className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
          >
            <AiFillControl size={24} />
            <span className="text-sm font-semibold">Admin</span>
          </Link>
        )}
        {userRole === 'owner' && (
          <Link
            href={`/shop-cms`}
            className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
          >
            <AiFillControl size={24} />
            <span className="text-sm font-semibold">Admin</span>
          </Link>
        )}
        {children && (
          <Link
            href={`/${children.toLowerCase()}`}
            className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
          >
            {icon}
            <span className="text-sm font-semibold">{children}</span>
          </Link>
        )}
        {locale === 'zh' && (
          <Link
            href={`/life`}
            className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
          >
            <FaStarOfLife size={24} />
            <span className="text-sm font-semibold">生活</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
