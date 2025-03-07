'use server';

import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="w-full bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
        <div className="flex justify-center items-center md:items-start">
          <Image
            src="/transparent-mimi-logo.png"
            alt="Mimi Logo"
            quality={100}
            width={120}
            height={120}
            className="object-contain hover:opacity-90 transition-opacity"
          />
        </div>

        <section className="flex-1">
          <h2 className="text-xl font-medium mb-4">{t('about-title')}</h2>
          <p className="text-gray-300 font-normal leading-relaxed">{t('about-text')}</p>
        </section>

        <section className="flex-1">
          <h2 className="text-xl font-medium mb-4">{t('pages-title')}</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-gray-300 hover:text-white font-medium underline transition-colors"
              >
                {t('home')}
              </Link>
            </li>
            <li>
              <Link
                href="/user"
                className="text-gray-300 hover:text-white font-medium underline transition-colors"
              >
                {t('profile')}
              </Link>
            </li>
            <li>
              <Link
                href="/my-cart"
                className="text-gray-300 hover:text-white font-medium underline transition-colors"
              >
                {t('cart')}
              </Link>
            </li>
          </ul>
        </section>

        <section className="flex-1">
          <h2 className="text-xl font-medium mb-4">{t('payment-methods-title')}</h2>
          <p className="text-gray-300 font-normal">{t('payment-methods-text')}</p>
        </section>

        <section className="flex-1">
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

      <div className="mt-8 border-t border-gray-700 pt-6 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Mimi. {t('all-rights-reserved')}
        </p>
      </div>
    </footer>
  );
}
