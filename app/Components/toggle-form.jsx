'use client';

import { useState } from 'react';
import { PreLoginForm, PreSigninForm } from './pre-auth';
import Button from './button';

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);

  function toggleSwitch(event) {
    event.preventDefault();
    setIsSignup((prev) => !prev);
  }

  return (
    <>
      {!isSignup ? (
        <PreLoginForm>
          <Button onClick={toggleSwitch}>I do not have an account</Button>
        </PreLoginForm>
      ) : (
        <PreSigninForm>
          <Button onClick={toggleSwitch}>I already have an account</Button>
        </PreSigninForm>
      )}
    </>
  );
}
