'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { login, preLogin, preSignup, signup } from '../auth/actions';
import FormInput from './form-input';
import Form from './form';
import Button from './button';
import { useRouter, useSearchParams } from 'next/navigation';

export function PreLoginForm({ children }) {
  const [preLoginState, preLoginAction] = useFormState(preLogin, '');
  const [loginState, loginAction] = useFormState(login, '');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  console.log(loginState);

  useEffect(() => {
    if (loginState.status === 200) {
      router.push(redirect);
    }
  }, [loginState.status]);

  console.log(preLoginState);
  return (
    <>
      {preLoginState.phone ? (
        <Form action={loginAction} title="Log in">
          <FormInput
            key={preLoginState.phone}
            type="tel"
            required
            id="sms-confirm"
            label={`Confirm Code Sent as SMS on phone: ${preLoginState.phone}*`}
          />
          <input type="hidden" value={preLoginState.phone} name="phone" />
          <Button type="submit">Confirm</Button>
          {loginState.error && <p className="text-red-700">{loginState.error}</p>}
          {children}
        </Form>
      ) : (
        <Form action={preLoginAction} title="Log in">
          <FormInput inputMode="tel" id="phone" label="Phone" type="number" />
          {preLoginState.error && <p className="text-red-700">{preLoginState.error}</p>}
          <Button type="submit">Log in</Button>
          {children}
        </Form>
      )}
    </>
  );
}

export function PreSigninForm({ children }) {
  const [preSignupState, preSignupAction] = useFormState(preSignup, '');
  const [signupState, signupAction] = useFormState(signup, '');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  console.log(signupState);

  useEffect(() => {
    if (signupState.status === 200) {
      router.push(redirect);
    }
  }, [signupState.status]);

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
          <input type="hidden" name="phone" value={preSignupState.phone} />
          <Button type="submit">Confirm</Button>
          {signupState?.error && <p className="text-red-700">{signupState?.error}</p>}
          {children}
        </Form>
      ) : (
        <Form action={preSignupAction} title="Sign Up">
          <FormInput inputMode="tel" id="phone" label="Phone" type="tel" />
          <FormInput id="invite-code" required={false} label="Invite Code (Optional)" />
          {preSignupState.error && <p className="text-red-700">{preSignupState.error}</p>}
          <Button type="submit">Sign up</Button>
          {children}
        </Form>
      )}
    </>
  );
}
