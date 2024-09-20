'use client';

import { useState } from 'react';
import Button from './button';
import Form from './form';
import FormInput from './form-input';
import Modal from './modal';

export default function EditProfile({ id }) {
  const [isClicked, setIsClicked] = useState(false);

  function handleEditClick(event) {
    event.preventDefault();
    setIsClicked((prevState) => !prevState);
  }

  return (
    <>
      {isClicked ? (
        <Form title="Edit your Profile">
          <input name="user-id" value={id} type="hidden" />
          <FormInput label="Name" id="name" type="text" />
          <FormInput label="Address" id="address" type="text" />
          <FormInput label="Phone" id="phone" type="tel" />
          <FormInput label="Profile image" id="profile-image" type="file" />
          <Button type="submit">Submit</Button>
        </Form>
      ) : (
        <Button onClick={handleEditClick} className="rounded-2xl max-w-max">
          Edit Profile
        </Button>
      )}
    </>
  );
}
