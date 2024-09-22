'use server';

import EditProfile from '../Components/edit-profile';

export default async function ProfilePage({params}) {
    return <EditProfile id={params}/>
}