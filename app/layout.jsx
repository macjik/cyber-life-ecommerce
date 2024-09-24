import { cookies } from 'next/headers';
import localFont from 'next/font/local';
import './globals.css';
import NavBar from './Components/navbar';
import { jwtVerify } from 'jose';
import AskAdress from './Components/address';

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
  title: 'E-commerce',
  description: '',
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const currentPath = cookieStore.get('currentPath')?.value || '';

  const allowedPaths = ['/auth', '/product']
  console.log('layout' + cookieStore);
  const isAllowedRoute = allowedPaths.includes(currentPath);
  console.log('Is Auth Route:', isAllowedRoute);

  const token = cookieStore.get('token')?.value;

  let user = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      user = payload;
      console.log(payload);
      console.log(payload.id);
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200`}>
        {!isAllowedRoute && <NavBar userRole={user.role} />}
        {user && !user.address ? <AskAdress></AskAdress> : null}
        <main>{children}</main>
      </body>
    </html>
  );
}
