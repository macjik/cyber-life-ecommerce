'use server';

import AskAdress from './Components/address';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Link from 'next/link';

export default async function Home() {
  return (
    <>
      <header className="fixed right-24 top-4">
        {/* {user?.role === 'admin' && (
          <Link className="p-3 text-xl" href="/admin">
            Admin
          </Link>
        )} */}
      </header>
      {/* {user && !user.address ? <AskAdress></AskAdress> : null} needs change */}
    </>
  );
}
