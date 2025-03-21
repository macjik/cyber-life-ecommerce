'use server';

import AuthForm from '../Components/toggle-form';
import { getTranslations } from 'next-intl/server';

export default async function AuthPage() {
  const t = await getTranslations('Auth');
  return (
    <main className="w-full flex min-h-screen mx-auto px-0 bg-gray-50">
      <div className="w-full md:w-7/12 lg:w-8/12 min-h-screen bg-white shadow-lg p-8 flex items-center justify-center rounded-t-lg">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>

      <div
        className={`w-5/12 lg:w-4/12 min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] hidden md:flex items-center justify-center p-8 transition-all duration-500 hover:from-[#764ba2] hover:to-[#667eea] rounded-tr-lg`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('welcome-title')}</h1>
          <p className="text-lg text-gray-200">{t('welcome')}</p>
        </div>
      </div>
    </main>
  );
}
