import useLocale from '@/app/services/locale';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = await useLocale();

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
