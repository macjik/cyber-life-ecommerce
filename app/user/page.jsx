'use server';

import db from '@/models/index';
import UserProfile from '../Components/user-profile';
db.sequelize.sync();
const User = db.User;

export default async function UserPage({ searchParams }) {
  const userId = searchParams?.id;
  const user = await User.findOne({ where: { sub: userId } });

  const { phone, address, sub } = user;

  return (
    <main className="w-full h-full flex justify-center items-center">
      <UserProfile phone={phone} address={address} />
    </main>
  );
}
