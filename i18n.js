import { getRequestConfig } from 'next-intl/server';
import useLocale from './app/services/locale';

export default getRequestConfig(async () => {
  const locale = await useLocale();

  let messages;
  try {
    messages = (await import(`./app/public/locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale ${locale}:`, error);
    messages = (await import(`./app/public/locales/en.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
