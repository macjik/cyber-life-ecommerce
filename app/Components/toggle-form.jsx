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
          <Button
            className="bg-white border-blue-600 border-2 rounded-l-none rounded-r text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={toggleSwitch}
          >
            Create account
          </Button>
        </PreLoginForm>
      ) : (
        <PreSigninForm>
          <Button
            className="bg-white border-blue-600 border-2 rounded-l-none rounded-r text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={toggleSwitch}
          >
            I have an account
          </Button>
        </PreSigninForm>
      )}
    </>
  );
}
