'use client';

import Link from 'next/link';
import Button from './button';
import Form from './form';
import FormInput from './form-input';
import { useFormState } from 'react-dom';
import { editProfile } from '../form-actions/edit-profile-action';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfile({ id }) {
  const [editProfileState, editProfileAction] = useFormState(editProfile, '');
  const [isSmsSent, setIsSmsSent] = useState(false);
  const phoneRef = useRef(null);
  const router = useRouter();

  function handleSendSms(event) {
    event.preventDefault();

    const phone = phoneRef.current.value.trim();

    if (phone.length === 9 && /^\d+$/.test(phone)) {
      setIsSmsSent(true);
      phoneRef.current.style.borderColor = '';
      phoneRef.current.style.borderWidth = '';
    } else {
      setIsSmsSent(false);
      phoneRef.current.style.borderColor = 'red';
      phoneRef.current.style.borderWidth = '2px';
    }
  }

  useEffect(() => {
    if (editProfileState?.status === 200) {
      router.replace('/user');
    }
  });

  return (
    <Form title="Edit your Profile" action={editProfileAction}>
      <input name="user-id" value={id} type="hidden" />

      <div className={isSmsSent ? 'hidden' : 'block space-y-4'}>
        <FormInput label="Name" id="name" type="text" />
        <FormInput label="Address" id="address" type="text" />
        <FormInput
          label="Phone +998 (*** ** **)"
          placeholder="e.g: 99 1234567"
          innerRef={phoneRef}
          id="phone"
          type="tel"
        />
        <Button className="mt-4" onClick={handleSendSms}>
          Send SMS
        </Button>
      </div>

      <div style={{ display: isSmsSent ? 'block' : 'none' }}>
        <FormInput label="SMS code" id="sms-code" type="number" />
        <Button className="mt-4" type="submit">
          Confirm SMS code
        </Button>
      </div>

      {editProfileState?.error && <p className="text-red-700">{editProfileState.error}</p>}
    </Form>
  );
}
