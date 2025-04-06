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
import { useTranslations } from 'next-intl';

function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 rounded-l text-white max-w-max">
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export default function EditProfile({ id, name }) {
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

  const t = useTranslations('profile');
  return (
    <Form title={t('edit')} action={editProfileAction}>
      <input name="user-id" value={id} type="hidden" />
      <FormInput label={t('name')} id="name" type="text" defaultValue={name} required={false} />
      <FormInput label={t('image')} id="image" type="file" required={false} />
      <div className="inline-flex w-full justify-center">
        <SubmitButton>{t('confirm')}</SubmitButton>
        <Link href="/user">
          <Button className="bg-white border-2 border-blue-600 text-blue-600 rounded-r w-50">
            {t('back')}
          </Button>
        </Link>
      </div>
      {editProfileState?.error && <p className="text-red-700">{editProfileState.error}</p>}
    </Form>
  );
}
