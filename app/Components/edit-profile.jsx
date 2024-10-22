'use client';

import Link from 'next/link';
import Button from './button';
import Form from './form';
import FormInput from './form-input';
import { useFormState, useFormStatus } from 'react-dom';
import { editProfile } from '../form-actions/edit-profile-action';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from './spinner';

function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export default function EditProfile({ id, name, image }) {
  const [editProfileState, editProfileAction] = useFormState(editProfile, '');
  const router = useRouter();

  // function handleSendSms(event) {
  //   event.preventDefault();

  //   const phone = phoneRef.current.value.trim();

  //   if (phone.length === 9 && /^\d+$/.test(phone)) {
  //     setIsSmsSent(true);
  //     phoneRef.current.style.borderColor = '';
  //     phoneRef.current.style.borderWidth = '';
  //   } else {
  //     setIsSmsSent(false);
  //     phoneRef.current.style.borderColor = 'red';
  //     phoneRef.current.style.borderWidth = '2px';
  //   }
  // }

  useEffect(() => {
    if (editProfileState?.status === 200) {
      router.replace('/user');
    }
  });

  return (
    <Form title="Edit your Profile" action={editProfileAction}>
      <input name="user-id" value={id} type="hidden" />
      <FormInput label="Name" id="name" type="text" defaultValue={name} required={false} />
      <FormInput label="Profile Image" id="image" type="file" defaultValue={image} required={false} />
      <SubmitButton>Confirm</SubmitButton>
      <Link href="/user">
        <Button className="mt-3">Back</Button>
      </Link>
      {editProfileState?.error && <p className="text-red-700">{editProfileState.error}</p>}
    </Form>
  );
}
