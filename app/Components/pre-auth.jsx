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

function SubmitButton({ children }) {
  const { pending } = useFormStatus();
  const status = useFormStatus();
  console.log(status);
  console.log(pending);
  return (
    <Button type="submit" disabled={pending} className="text-center">
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export function PreLoginForm({ children }) {
  const [loginState, loginAction] = useFormState(login, '');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (loginState.status === 200) {
      window.location.href = redirect;
    }
  }, [loginState.status]);

  return (
    <Form action={loginAction} title="Log in">
      <FormInput inputMode="tel" id="phone" label="Phone" type="number" />
      <FormInput id="password" label="Password*" type="password" />
      {loginState.error && <p className="text-red-700">{loginState.error}</p>}
      <SubmitButton>Log in</SubmitButton>
      {children}
    </Form>
  );
}

export function PreSigninForm({ children }) {
  const [preSignupState, preSignupAction] = useFormState(preSignup, '');
  const [signUpError, setSignUpError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // useEffect(() => {
  //   if (signupState.status === 200) {
  //     router.push(redirect);
  //   }
  // }, [signupState.status]);

  async function handleSignUp(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const sms = formData.get('sms-confirm');

    let res = await axios.post('/api/signup', { userData: preSignupState, sms });
    res = res.data;

    if (loginState.status === 200) {
      window.location.href = redirect;
    }
    if (res.error) {
      setSignUpError(res.error);
    }
  }

  return (
    <>
      {preSignupState.phone ? (
        <Form onSubmit={handleSignUp} title="Confirm Sms">
          <FormInput
            key={preSignupState.phone}
            type="number"
            required
            id="sms-confirm"
            label={`Confirm Code Sent as SMS on ${preSignupState.phone}`}
          />
          {signUpError && <p className="text-red-700">{signUpError}</p>}
          <SubmitButton>Confirm</SubmitButton>
          {children}
        </Form>
      ) : (
        <Form action={preSignupAction} title="Sign up">
          <FormInput inputMode="tel" id="phone" label="Phone*" type="tel" />
          <FormInput id="password" label="Password*" type="password" />
          {preSignupState.error && <p className="text-red-700">{preSignupState.error}</p>}
          <SubmitButton>Register</SubmitButton>
          {children}
        </Form>
      )}
    </>
  );
}
