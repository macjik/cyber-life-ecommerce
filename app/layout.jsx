import localFont from 'next/font/local';
import './globals.css';
import NavBar from './Components/NavBar';
import { cookies } from 'next/headers';

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
  const cookieStore = cookies();
  const userRole = cookieStore.get('userRole')?.value || null;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200`}>
        <NavBar userRole={userRole} />
        <main>{children}</main>
      </body>
    </html>
  );
}
