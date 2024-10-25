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
    <div className='p-3 w-full min-h-screen'>
      {!isSignup ? (
        <PreLoginForm>
          <Button
            onClick={toggleSwitch}
            className="bg-white text-blue-600 border-2 border-blue-600 rounded-r hover:bg-blue-600 hover:text-white"
          >
            Create an Account
          </Button>
        </PreLoginForm>
      ) : (
        <PreSigninForm>
          <Button
            className="bg-white text-blue-600 border-2 border-blue-600 rounded-r hover:bg-blue-600 hover:text-white"
            onClick={toggleSwitch}
          >
            Already registered?
          </Button>
        </PreSigninForm>
      )}
    </div>
  );
}
