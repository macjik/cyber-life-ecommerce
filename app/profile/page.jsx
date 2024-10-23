'use server';

import db from '@/models/index';
import EditProfile from '../Components/edit-profile';

const {User} = db;

export default async function ProfilePage(props) {
  const searchParams = await props.searchParams;
  const {id} = searchParams;

  let user = await User.findOne({where: {sub:id}})

  return <EditProfile id={user.id} name={user?.name && user.name}/>;
}
