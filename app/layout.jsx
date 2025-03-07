import localFont from 'next/font/local';
import './globals.css';
import NavBar from './Components/navbar';
import { headers } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Footer from './Components/footer';
import Locales from './Components/locales';
import ShopsNav from './Components/shops-nav';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Mimi e-commerce',
  description: '',
};

export default async function RootLayout({ children }) {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path');
  const userRole = headersList.get('x-user-role') || 'guest';

  const isAllowedRoute = !currentPath.startsWith('/auth') && !/\/item(\/|$)/.test(currentPath);

  const locale = await getLocale();
  const messages = await getMessages();
  //<FontAwesomeIcon icon="fa-solid fa-earth-asia" />
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-red-100 via-blue-100 to-indigo-100 min-h-full`}
      >
        <Locales />
        <NavBar locale={locale} userRole={userRole} isAllowedRoute={isAllowedRoute} />
        <NextIntlClientProvider messages={messages}>
          {/* {userRole !== 'guest' && <ShopsNav />} */}
          {children}
        </NextIntlClientProvider>
        <Footer />
      </body>
    </html>
  );
}
