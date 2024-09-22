'use server';

import Image from 'next/image';
import Button from './button';
import Link from 'next/link';

export default async function UserProfile({ userId, name = '', phone, avatarUrl = null, address }) {
  return (
    <div className="mx-auto p-6 bg-white shadow-lg overflow-hidden lg:flex transform transition duration-300 hover:shadow-2xl w-full">
      <div className="lg:flex lg:flex-shrink-0">
        <div className="flex items-center justify-center lg:items-start lg:justify-start bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full p-1 lg:p-3">
          <Image
            className="rounded-full w-32 h-32"
            src={avatarUrl || '/image.png'}
            alt="profile image"
            height={128}
            width={128}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      <div className="flex-1 mt-6 lg:mt-0 lg:ml-6">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-semibold text-gray-900">{name || 'What is your name?'}</h1>
          <p className="mt-2 text-lg text-gray-600">Phone: +998 {phone}</p>
          <p className="mt-4 text-gray-600 text-base">Address: {address}</p>
        </div>
        <div className="mt-6 text-center lg:text-left">
          <Link href="/profile">
            <Button className="rounded-2xl max-w-max">Edit Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
