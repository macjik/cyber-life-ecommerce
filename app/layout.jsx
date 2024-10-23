import localFont from 'next/font/local';
import './globals.css';
import NavBar from './Components/navbar';
import { headers } from 'next/headers';

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
  const headersList = await headers();
  const currentPath = headersList.get('x-current-path');
  const userRole = headersList.get('x-user-role') || 'guest';

  const isAllowedRoute = !currentPath.startsWith('/auth') && !/^\/[^/]+\/[^/]+$/.test(currentPath);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200`}>
        <NavBar userRole={userRole} isAllowedRoute={isAllowedRoute} />
        <main>{children}</main>
      </body>
    </html>
  );
}
