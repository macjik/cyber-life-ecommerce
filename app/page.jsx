'use server';

import AddContentButton from './Components/add-content-button';
import AskAdress from './Components/address';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = cookies();
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

  console.log(user.role);

  return (
    <>
      <header className='fixed right-24 top-4'>
        {user?.role === 'admin' && (
          <Link className="p-3 text-xl" href="/admin">
            Admin
          </Link>
        )}
      </header>
      <main className="w-full h-full p-6">
        <h1 className="font-bold text-3xl text-center">Manage Product Content</h1>
        <div className="flex w-100 p-2 mt-14">
          <AddContentButton />
        </div>
        {user && !user.address ? <AskAdress></AskAdress> : null} {/*needs change*/}
      </main>
    </>
  );
}
