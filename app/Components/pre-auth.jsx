'use client';

import { useState, useEffect } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { login, preSignup, signup } from '../auth/actions';
import FormInput from './form-input';
import Form from './form';
import Button from './button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from './spinner';

function SubmitButton({ children }) {
  const { pending } = useFormStatus();
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

  if (loginState.status === 200) {
    router.push(redirect);
  }

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

// PreSigninForm Component
export function PreSigninForm({ children }) {
  const [preSignupState, preSignupAction] = useFormState(preSignup, '');
  const [signupState, signupAction] = useFormState(signup, '');
  const signupStatus = useFormStatus(); // Track signup form status
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [signUpError, setSignUpError] = useState('');

  // Handle successful signup redirection
  useEffect(() => {
    if (signupState.status === 200) {
      router.push(redirect);
    }
  }, [signupState.status, router, redirect]);

  // Track signup errors
  useEffect(() => {
    if (signupState.error) {
      setSignUpError(signupState.error);
    }
  }, [signupState.error]);

  return (
    <>
      {preSignupState.phone ? (
        <Form action={signupAction} title="Sign up">
          <FormInput
            key={preSignupState.phone}
            type="number"
            required
            id="sms-confirm"
            label={`Confirm Code Sent as SMS on ${preSignupState.phone}`}
          />
          {signUpError && <p className="text-red-700">{signUpError}</p>}
          <Button type="submit" disabled={signupStatus.pending}>
            {signupStatus.pending ? 'Confirming...' : 'Confirm'}
          </Button>
          {children}
        </Form>
      ) : (
        <Form action={preSignupAction} title="Sign Up">
          <FormInput inputMode="tel" id="phone" label="Phone*" type="tel" />
          <FormInput id="password" label="Password*" type="password" />
          {preSignupState.error && <p className="text-red-700">{preSignupState.error}</p>}
          <Button type="submit" disabled={signupStatus.pending}>
            {signupStatus.pending ? 'Signing up...' : 'Sign up'}
          </Button>
          {children}
        </Form>
      )}
    </>
  );
}
