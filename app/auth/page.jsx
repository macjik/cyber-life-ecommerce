'use server';

import AuthForm from '../Components/auth-form';

export default async function AuthPage() {
  return (
    <main className="w-full h-full">
      <AuthForm />;
    </main>
  );
}
