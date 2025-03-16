'use server';

import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Logo from '../../public/transparent-mimi-logo.webp';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="w-full flex bg-gray-800 text-white py-12 mx-auto max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="flex justify-center lg:justify-start items-center">
            <Image
              src={Logo}
              alt="Mimi Logo"
              quality={100}
              width={120}
              height={120}
              className="object-contain hover:opacity-90 transition-opacity"
            />
          </div>

          <section className="text-center lg:text-left">
            <h2 className="text-xl font-medium mb-4">{t('pages-title')}</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white font-normal underline transition-colors"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/user"
                  className="text-gray-300 hover:text-white font-normal underline transition-colors"
                >
                  {t('profile')}
                </Link>
              </li>
              <li>
                <Link
                  href="/my-cart"
                  className="text-gray-300 hover:text-white font-normal underline transition-colors"
                >
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </section>

          <section className="text-center lg:text-left">
            <h2 className="text-xl font-medium mb-4">{t('payment-methods-title')}</h2>
            <p className="text-gray-300 font-normal">{t('payment-methods-text')}</p>
          </section>

          <section className="text-center lg:text-left">
            <h2 className="text-xl font-medium mb-4">{t('contacts')}</h2>
            <ul className="space-y-2">
              <li>
                <p className="text-gray-300 font-normal">
                  {t('tel')}:
                  <a
                    href="tel:+998977217600"
                    className="underline hover:text-white transition-colors"
                  >
                    +998977217600
                  </a>
                </p>
              </li>
              <li>
                <p className="text-gray-300 font-normal">
                  {t('telegram-bot')}:
                  <a
                    href="https://t.me/mimi_uz_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white transition-colors"
                  >
                    Mimi bot
                  </a>
                </p>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Mimi. {t('all-rights-reserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
