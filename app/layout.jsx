import localFont from 'next/font/local';
import './globals.css';
import NavBar from './Components/navbar';
import { headers } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Footer from './Components/footer';
import Locales from './Components/locales';

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

  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <div className="mx-auto max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-2">
          <Locales />
          <NavBar locale={locale} userRole={userRole} currentPath={currentPath} />
          <NextIntlClientProvider messages={messages}>
            {/* {userRole !== 'guest' && <ShopsNav />} */}
            {children}
          </NextIntlClientProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
