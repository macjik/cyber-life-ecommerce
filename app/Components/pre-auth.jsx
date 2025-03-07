'use client';

import { useState, useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { login, preSignup } from '../auth/actions';
import FormInput from './form-input';
import Form from './form';
import Button from './button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from './spinner';
import axios from '@/node_modules/axios/index';
import { useTranslations } from 'next-intl';
import Link from '@/node_modules/next/link';

function SubmitButton({ children, isPending }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || isPending}
      className="text-center text-white bg-blue-600 rounded-r-none rounded-l focus:outline-none p-0"
    >
      {pending || isPending ? <Spinner /> : children}
    </Button>
  );
}

export function PreLoginForm({ children }) {
  const [loginState, loginAction] = useFormState(login, '');
  const [isPending, setIsPending] = useState(false);
  const [phone, setPhone] = useState('');
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (loginState.status === 200 && !isPending) {
      setIsPending(true);
      window.location.href = redirect;
    }
  }, [loginState.status, isPending, redirect]);

  const handlePhoneChange = (event) => {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 2) {
      input = `(${input.slice(0, 2)}) ${input.slice(2)}`;
    }
    if (input.length > 8) {
      input = `${input.slice(0, 8)}-${input.slice(8)}`;
    }
    if (input.length > 11) {
      input = `${input.slice(0, 11)}-${input.slice(11, 13)}`;
    }
    setPhone(input);
  };

  const t = useTranslations('Auth');
  return (
    <Form action={loginAction} title={t('login')}>
      <div className="inline-flex w-full">
        <div className="bg-slate-300 text-gray-600 border-2 rounded-l border-gray-300 h-9 font-medium text-center p-1 text-sm mt-2">
          +998
        </div>
        <div className="flex-grow">
          <FormInput
            className="border-l-0 h-9 w-full flex-grow rounded-l-none font-medium text-gray-700"
            inputMode="tel"
            id="phone"
            placeholder="(xx) xxx-xx-xx"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            maxLength="14"
          />
        </div>
      </div>
      <FormInput id="password" label={`${t('password')}*`} type="password" minLength="6" />
      <div className="w-full text-right my-2 px-3">
        <Link href="/reset-password" className="text-end">
          <span className="text-blue-700 text-sm underline">{t('forgot-password')}</span>
        </Link>
      </div>
      {loginState.error && <p className="text-red-700">{loginState.error}</p>}
      <div className="inline-flex w-full">
        <SubmitButton isPending={isPending}>{t('login')}</SubmitButton>
        {children}
      </div>
    </Form>
  );
}

export function PreSigninForm({ children }) {
  const [preSignupState, preSignupAction] = useFormState(preSignup, '');
  const [signUpError, setSignUpError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // useEffect(() => {
  //   if (signupState.status === 200) {
  //     router.push(redirect);
  //   }
  // }, [signupState.status]);

  const handlePhoneChange = (event) => {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 2) {
      input = `(${input.slice(0, 2)}) ${input.slice(2)}`;
    }
    if (input.length > 8) {
      input = `${input.slice(0, 8)}-${input.slice(8)}`;
    }
    if (input.length > 11) {
      input = `${input.slice(0, 11)}-${input.slice(11, 13)}`;
    }
    setPhone(input);
  };

  async function handleSignUp(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const sms = formData.get('sms-confirm');

    setIsPending(true);
    let res = await axios.post('/api/signup', { userData: preSignupState, sms });
    res = res.data;

    if (res.status === 200) {
      window.location.href = redirect;
    }
    if (res.error) {
      setSignUpError(res.error);
      setIsPending(false);
    }
  }

  const t = useTranslations('Auth');
  return (
    <>
      {preSignupState.phone ? (
        <Form onSubmit={handleSignUp} title={t('confirm-sms')}>
          <div className="mt-6">
            <FormInput
              key={preSignupState.phone}
              type="tel"
              required
              placeholder="xxxx"
              id="sms-confirm"
              label={`${t('confirm-sms')} +998 ${preSignupState.phone}`}
              maxLength="4"
              minLength="4"
            />
          </div>
          {signUpError && <p className="text-red-700">{signUpError}</p>}
          <div className="inline-flex w-full">
            <Button
              type="submit"
              className="text-white rounded-lg bg-blue-600 text-xl"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : t('confirm')}
            </Button>
          </div>
        </Form>
      ) : (
        <Form action={preSignupAction} title={t('signup')}>
          <div className="inline-flex w-full">
            <div className="bg-slate-300 text-gray-600 border-2 rounded-l border-gray-300 h-9 font-medium text-center p-1 text-sm mt-2">
              +998
            </div>
            <div className="flex-grow">
              <FormInput
                className="border-l-0 h-9 w-full flex-grow rounded-l-none font-medium text-gray-700"
                inputMode="tel"
                id="phone"
                placeholder="(xx) xxx-xx-xx"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="14"
              />
            </div>
          </div>{' '}
          <FormInput id="password" label={`${t('password')}*`} type="password" minLength="6" />
          {preSignupState.error && <p className="text-red-700">{preSignupState.error}</p>}
          <div className="inline-flex w-full mt-8">
            <SubmitButton>{t('signup')}</SubmitButton>
            {children}
          </div>
        </Form>
      )}
    </>
  );
}
