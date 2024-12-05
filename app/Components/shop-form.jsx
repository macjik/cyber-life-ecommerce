'use client';
import { registerShop } from '../form-actions/company-request';
import Button from './button';
import Form from './form';
import FormInput from './form-input';
import { useFormState, useFormStatus } from 'react-dom';
import { Spinner } from './spinner';

function SubmitButton({ children, className = '' }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={`${className} bg-blue-600 text-white rounded-lg`}
      type="submit"
      disabled={pending}
    >
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export default function ShopForm({ user }) {
  const [shopState, shopAction] = useFormState(registerShop, '');

  if (shopState.status === 200) {
    window.location.href = '/';
  }

  return (
    <Form title="Enter your shop details" action={shopAction}>
      <FormInput label="Shop name*" id="name" type="text" />
      <FormInput label="Shop logo" id="image" type="file" />
      <FormInput label="Shop description" id="description" type="text" />
      <FormInput label="Shop slogan" id="slogan" />
      <input value={user} type="hidden" name="user" />
      <SubmitButton>Submit</SubmitButton>
    </Form>
  );
}
