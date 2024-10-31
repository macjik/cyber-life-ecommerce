import localFont from 'next/font/local';
import './globals.css';
import NavBar from './Components/navbar';
import { headers } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Footer from './Components/footer';

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

  const isAllowedRoute = !currentPath.startsWith('/auth') && !/^\/[^/]+\/[^/]+$/.test(currentPath);

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-red-100 via-blue-100 to-indigo-100 min-h-full`}
      >
        <NavBar userRole={userRole} isAllowedRoute={isAllowedRoute} />
        <NextIntlClientProvider messages={messages}>
          <main>{children}</main>
        </NextIntlClientProvider>
        <Footer />
      </body>
    </html>
  );
}
