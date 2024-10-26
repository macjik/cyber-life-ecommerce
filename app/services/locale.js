'use server';

import { cookies } from 'next/headers';

export default async function useLocale() {
  const cookieStore = cookies();
  let locale = cookieStore.get('locale')?.value;

  if (!locale) {
    locale = 'en';
  }

  return locale;
}