'use client';

import Link from 'next/link';
import Button from './button';
import Form from './form';
import FormInput from './form-input';

export default function EditProfile({ id }) {
  return (
    <Form title="Edit your Profile">
      <input name="user-id" value={id} type="hidden" />
      <FormInput label="Name" id="name" type="text" />
      <FormInput label="Address" id="address" type="text" />
      <FormInput label="Phone" id="phone" type="tel" />
      <FormInput label="Profile image" id="profile-image" type="file" />
      <Button type="submit">Submit</Button>
      <Link href="/user">
        <Button className="mt-4">Back</Button>
      </Link>
    </Form>
  );
}
