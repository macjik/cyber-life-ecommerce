'use server';

import AddContentButton from './Components/add-content-button';
import AddressModal from './Components/address-modal';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

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

  return (
    <main className="w-full h-full p-6">
      <h1 className="font-bold text-3xl text-center">Manage Product Content</h1>
      <div className="flex w-100 p-2 mt-14">
        <AddContentButton />
      </div>
      {user && !user.address ? <AddressModal></AddressModal> : null} {/*needs change*/}
    </main>
  );
}
