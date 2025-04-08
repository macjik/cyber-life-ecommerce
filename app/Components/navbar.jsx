import Link from 'next/link';
import { FaUser, FaShoppingCart, FaHome } from 'react-icons/fa';
import { AiFillControl } from 'react-icons/ai';
import { useTranslations } from 'next-intl';

export default function NavBar({ userRole, currentPath }) {
  const t = useTranslations();

  const isAllowedRoute = !currentPath.startsWith('/auth') && !/\/item(\/|$)/.test(currentPath);

  if (!isAllowedRoute) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-17 z-50 shadow-lg">
      <div className="flex items-center mx-auto max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full py-2">
        <Link
          prefetch={true}
          href="/user"
          className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
        >
          <FaUser size={24} />
          <span className="text-sm font-semibold">{t('user')}</span>
        </Link>
        <Link
          prefetch={true}
          href="/"
          className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
        >
          <FaHome size={24} />
          <span className="text-sm font-semibold">{t('home')}</span>
        </Link>
        <Link
          prefetch={true}
          href="/my-cart"
          className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
        >
          <FaShoppingCart size={24} />
          <span className="text-sm font-semibold">{t('cart')}</span>
        </Link>
        {userRole === 'admin' && (
          <Link
            prefetch={true}
            href="/admin"
            className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
          >
            <AiFillControl size={24} />
            <span className="text-sm font-semibold">Admin</span>
          </Link>
        )}
        {userRole === 'owner' && (
          <Link
            prefetch={true}
            href="/shop-cms"
            className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
          >
            <AiFillControl size={24} />
            <span className="text-sm font-semibold">Admin</span>
          </Link>
        )}
        {/* {locale === 'zh' && (
          <Link
            href="/life"
            className="flex flex-col items-center text-gray-600 hover:text-cyan-600 w-full"
          >
            <FaStarOfLife size={24} />
            <span className="text-sm font-semibold">生活</span>
          </Link>
        )} */}
      </div>
    </nav>
  );
}
