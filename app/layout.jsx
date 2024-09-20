import { cookies } from 'next/headers';
import localFont from 'next/font/local';
import './globals.css';
import NavBar from './Components/navbar';

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
  title: 'Application',
  description: '',
};

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const currentPath = cookieStore.get('currentPath')?.value || '';

  const isAuthRoute = currentPath.startsWith('/auth');
  console.log('Is Auth Route:', isAuthRoute);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200`}>
        {!isAuthRoute && <NavBar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
