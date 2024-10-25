'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { login, preLogin, preSignup, signup } from '../auth/actions';
import FormInput from './form-input';
import Form from './form';
import Button from './button';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

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
    // <>
    //   {preLoginState.phone ? (
    //     <Form action={loginAction} title="Log in">
    //       <FormInput
    //         key={preLoginState.phone}
    //         type="tel"
    //         required
    //         id="sms-confirm"
    //         label={`Confirm Code Sent as SMS on phone: ${preLoginState.phone}*`}
    //       />
    //       <input type="hidden" value={preLoginState.phone} name="phone" />
    //       <Button type="submit">Confirm</Button>
    //       {loginState.error && <p className="text-red-700">{loginState.error}</p>}
    //       {children}
    //     </Form>
    // ) : (
    <Form action={loginAction} title="Log in">
      <FormInput inputMode="tel" id="phone" label="Phone" type="number" />
      <FormInput id="password" label="Password*" type="password" />
      {loginState.error && <p className="text-red-700">{loginState.error}</p>}
      <Button type="submit">Log in</Button>
      {children}
    </Form>
    //   )}
    // </>
  );
}

export function PreSigninForm({ children }) {
  const [preSignupState, preSignupAction] = useFormState(preSignup, '');
  // const [signupState, signupAction] = useFormState(signup, '');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [signUpError, setSignUpError] = useState('');

  // console.log(signupState);

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

    if (res.status === 200) {
      router.push(redirect);
    }
    if (res.error) {
      setSignUpError(res.error);
    }
  }

  return (
    <>
      {preSignupState.phone ? (
        <Form onSubmit={handleSignUp} title="Sign up">
          <FormInput
            key={preSignupState.phone}
            type="number"
            required
            id="sms-confirm"
            label={`Confirm Code Sent as SMS on ${preSignupState.phone}`}
          />
          {/* <input type="hidden" name="phone" value={preSignupState.phone} />
          <input type="hidden" name="password" value={preSignupState.password} /> */}
          {signUpError && <p className="text-red-700">{signUpError}</p>}
          <Button type="submit">Confirm</Button>
          {children}
        </Form>
      ) : (
        <Form action={preSignupAction} title="Sign Up">
          <FormInput inputMode="tel" id="phone" label="Phone*" type="tel" />
          <FormInput id="password" label="Password*" type="password" />
          <FormInput id="invite-code" required={false} label="Invite Code (Optional)" />
          {preSignupState.error && <p className="text-red-700">{preSignupState.error}</p>}
          <Button type="submit">Sign up</Button>
          {children}
        </Form>
      )}
    </>
  );
}
