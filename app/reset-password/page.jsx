'use server';

import {ResetPasswordForm} from '../Components/reset-password';

export default async function ResetPasswordPage() {
  return (
    <div className="w-full p-10 mt-20">
      <ResetPasswordForm />
    </div>
  );
}
