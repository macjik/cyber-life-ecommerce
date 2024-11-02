'use client';

import Button from './button';
import { useFormState, useFormStatus } from 'react-dom';
import FormInput from './form-input';
import { Spinner } from './spinner';
import { changePassword, checkPhone, confirmSmsCode } from '../form-actions/reset-password';
import { useSearchParams } from 'next/navigation';

function SubmitButton({ children }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="text-center text-lg text-white bg-blue-600 rounded focus:outline-none"
    >
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export function ResetPasswordForm() {
  const [validPhone, validatePhone] = useFormState(checkPhone, '');
  const [validSms, validateSms] = useFormState(confirmSmsCode, '');
  const [newPassword, createNewPassword] = useFormState(changePassword, '');
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  if (newPassword.status === 200) {
    window.location.href = redirect;
  }

  return (
    <>
      <header className="w-full">
        <h1 className="text-4xl text-center font-semibold">Forgot Password?</h1>
        <h3 className="text-center mt-3 text-lg">Reset password by getting verification code</h3>
      </header>

      {!validPhone.phone ? (
        <form action={validatePhone} className="mt-6 w-full max-w-md mx-auto justify-center">
          <div className="inline-flex mt-6 w-full justify-center">
            <span className="bg-slate-300 text-gray-600 border-2 rounded-l border-gray-300 h-12 font-medium text-center p-3 text-sm">
              +998
            </span>
            <div className="flex-grow mb-4">
              <FormInput
                className="h-12 rounded-l-none font-medium text-gray-700 mt-0"
                inputMode="tel"
                id="phone"
                placeholder="(xx) xxx-xx-xx"
                type="tel"
                maxLength="9"
              />
            </div>
          </div>
          {validPhone?.error && <p className="text-red-700 mb-3">{validPhone.error}</p>}
          <SubmitButton>Send verification code</SubmitButton>
        </form>
      ) : !validSms.phone ? (
        <form action={validateSms} className="mt-6 w-full max-w-md mx-auto justify-center">
          <div className="inline-flex mt-6 w-full justify-center">
            <div className="flex-grow mb-4">
              <input type="hidden" name="phone" value={validPhone.phone} />
              <FormInput
                className="h-12 font-medium text-gray-700 mt-0"
                inputMode="number"
                id="sms-code"
                label="Confirm SMS code sent to your phone"
                placeholder="xxxx"
                type="number"
                maxLength="4"
              />
            </div>
          </div>
          {validSms?.error && <p className="text-red-700 mb-3">{validSms.error}</p>}
          <SubmitButton>Verify code</SubmitButton>
        </form>
      ) : (
        <form action={createNewPassword} className="mt-6 w-full max-w-md mx-auto justify-center">
          <div className="inline-flex mt-6 w-full justify-center">
            <div className="flex-grow mb-4">
              <FormInput
                label="Create a new password"
                className="h-12 font-medium text-gray-700 mt-0"
                id="password"
                type="password"
                minLength="6"
              />
              <input type="hidden" name="phone" value={validSms.phone} />
            </div>
          </div>
          {newPassword?.error && <p className="text-red-700 mb-3">{newPassword.error}</p>}
          <SubmitButton>Create password</SubmitButton>
        </form>
      )}
    </>
  );
}
