'use server';

import EditProfile from '../Components/edit-profile';

export default async function ProfilePage({searchParams}) {
    return <EditProfile id={searchParams.id} />;
}