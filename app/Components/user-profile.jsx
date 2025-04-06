'use server';

import Image from 'next/image';
import Button from './button';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Logout from './logout';

export default async function UserProfile({
  // userId,
  name = '',
  phone,
  // avatarUrl = null,
  // address,
  image,
}) {
  const t = await getTranslations('profile');
  return (
    <div className="mx-auto p-6 bg-white shadow-lg overflow-hidden lg:flex transform transition duration-300 hover:shadow-2xl w-full max-h-max">
      <div className="lg:flex lg:flex-shrink-0">
        <div className="flex items-center justify-center lg:items-start lg:justify-start rounded-full p-1 lg:p-3">
          <Image
            src={image || '/blank-image.png'}
            alt="profile image"
            priority
            quality={100}
            width={128}
            height={128}
            className="object-cover w-32 h-32 rounded-full"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      <div className="flex-1 mt-6 lg:mt-0 lg:ml-6">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-semibold text-gray-900">{name || t('name?')}</h1>
          <p className="mt-2 text-lg text-gray-600">
            {t('phone')}: +998 {phone}
          </p>
          {/* <p className="mt-4 text-gray-600 text-base">Address: {address}</p> */}
        </div>
        <div className="mt-6 text-center lg:text-left space-x-2">
          <Logout />
          <Link href="/profile">
            <Button className="rounded-lg max-w-max bg-indigo-600 text-white p-1">
              {t('edit')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
