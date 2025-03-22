'use client';

import { registerShop } from '../form-actions/company-request';
import Button from './button';
import Form from './form';
import FormInput from './form-input';
import { useFormState, useFormStatus } from 'react-dom';
import { Spinner } from './spinner';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Shop');

  if (shopState.status === 200) {
    window.location.href = '/';
  }

  return (
    <Form title="Enter your shop details" action={shopAction}>
      <FormInput label={t('shop-form-title')} id="name" type="text" />
      <FormInput label={t('shop-name')} id="image" type="file" />
      <FormInput label={t('shop-description')} id="description" type="text" />
      <FormInput label={t('shop-slogan')} id="slogan" />
      <input value={user} type="hidden" name="user" />
      {<p className="text-red-600">{shopState.error}</p>}
      <SubmitButton>{t('submit')}</SubmitButton>
    </Form>
  );
}
