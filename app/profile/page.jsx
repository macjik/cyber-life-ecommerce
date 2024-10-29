'use server';

import db from '@/models/index';
import EditProfile from '../Components/edit-profile';

const { User } = db;

export default async function ProfilePage({ searchParams }) {
  const { id } = searchParams;

  let user = await User.findOne({ where: { sub: id } });

  return <div className='min-h-screen'>
  <EditProfile id={user.id} name={user?.name && user.name} />;
  </div> 
}
