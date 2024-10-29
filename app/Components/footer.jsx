'use server';

import Image from '@/node_modules/next/image';
import Link from '@/node_modules/next/link';
import {getTranslations} from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="w-full bg-slate-800 text-white font-bold p-4">
      <div className="mx-auto flex flex-col md:flex-row p-4 gap-10">
        <section className="mb-4 md:mb-0 w-max h-max text-sm relative">
          <Image
            src="/transparent-mimi-logo.png"
            alt="mimi logo"
            quality={100}
            width={100}
            height={100}
            className="object-contain h-max"
          />
        </section>
        <section className="mb-4 md:mb-0 max-w-max h-max text-sm">
          <h2 className="text-xl font-semibold mb-2 max-w-max">{t('about-title')}</h2>
          <p className="font-medium text-lg">
            {t('about-text')}
          </p>
        </section>

        <section className="mb-4 md:mb-0 w-max h-max text-sm">
          <h2 className="text-xl font-semibold mb-2 w-max">{t('pages-title')}</h2>
          <ul className="inline-flex flex-col gap-1 w-max mb-6">
            <li className="w-max">
              <Link href="/" className="hover:text-gray-400 font-medium underline text-lg">
                {t('home')}
              </Link>
            </li>
            <li className="w-max">
              <Link href="/user" className="hover:text-gray-400 font-medium underline text-lg">
                {t('profile')}
              </Link>
            </li>
            <li className="w-max">
              <Link href="/my-cart" className="hover:text-gray-400 font-medium underline text-lg">
                {t('cart')}
              </Link>
            </li>
            <li className="w-max">
              <Link href="#" className="hover:text-gray-400 font-medium underline text-lg">
                {t('policy')}
              </Link>
            </li>
          </ul>
        </section>
        <section className="mb-10 md:mb-0 text-sm max-w-max h-max space-y-2">
          <h2 className="text-xl font-semibold mb-2">{t('payment-methods-title')}</h2>
          <p className="text-lg font-medium">
           {t('payment-methods-text')}
          </p>
        </section>
        <section className="mb-10 md:mb-0 text-sm max-w-max h-max space-y-2">
          <h2 className="text-xl font-semibold mb-2">{t('contacts')}</h2>
          <p className="text-lg font-medium">
            {t('email')}:
            <a className="underline" href="mailto:mimi-cyberlife@gmail.com">
              Mimi@email
            </a>
          </p>
          <p className="text-lg font-medium">
            {t('tel')}:
            <a className="underline" href="tel:+123456789">
              +998977217600
            </a>
          </p>
          <p className="text-lg font-medium">
            {t('telegram-bot')}:
            <a className="underline" href="https://t.me/mimi_uz_bot">
              Mimi bot
            </a>
          </p>
        </section>
      </div>
    </footer>
  );
}
