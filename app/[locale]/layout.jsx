import localFont from 'next/font/local';
import './globals.css';
import NavBar from '../Components/navbar';
import { headers } from 'next/headers';
import { i18n, Locale } from '../../i18n-config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

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

export default async function RootLayout({ children, params }) {
  const headersList = headers();
  const currentPath = headersList.get('x-current-path');
  const userRole = headersList.get('x-user-role') || 'guest';

  const isAllowedRoute = !currentPath.startsWith('/auth') && !/^\/[^/]+\/[^/]+$/.test(currentPath);

  return (
    <html lang={params.lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200`}>
        <NavBar userRole={userRole} isAllowedRoute={isAllowedRoute} />
        <main>{children}</main>
      </body>
    </html>
  );
}
