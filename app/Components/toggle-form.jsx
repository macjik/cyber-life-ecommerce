'use client';

import { useState } from 'react';
import { PreLoginForm, PreSigninForm } from './pre-auth';
import Button from './button';
import { useTranslations } from 'next-intl';

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);

  function toggleSwitch(event) {
    event.preventDefault();
    setIsSignup((prev) => !prev);
  }

  const t = useTranslations('Auth');

  return (
    <div className="w-full mx-auto">
      {!isSignup ? (
        <PreLoginForm>
          <Button
            onClick={toggleSwitch}
            className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white py-1 rounded-l"
          >
            {t('register')}
          </Button>
        </PreLoginForm>
      ) : (
        <PreSigninForm>
          <Button
            className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white py-1 rounded-r"
            onClick={toggleSwitch}
          >
            {t('login')}
          </Button>
        </PreSigninForm>
      )}
    </div>
  );
}
