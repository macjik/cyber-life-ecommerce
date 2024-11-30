'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'uz', name: "O'zbek tili", flag: '/flags/uz-flag.png' },
  { code: 'en', name: 'English', flag: '/flags/en-flag.png' },
  { code: 'ru', name: 'Русский', flag: '/flags/ru-flag.png' },
  { code: 'zh', name: '中文', flag: '/flags/zh-flag.png' },
];

const translations = {
  uz: { welcome: 'Xush kelibsiz' },
  en: { welcome: 'Welcome' },
  ru: { welcome: 'Добро пожаловать' },
};

export default function Locales() {
  const [language, setLanguage] = useState('ru');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1];
    if (savedLocale) {
      setLanguage(savedLocale);
    }
  }, []);

  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
    document.cookie = `locale=${languageCode}; path=/; max-age=31536000`;

    router.refresh();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="mt-2 relative flex flex-col items-center space-y-4">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
      >
        <Image
          src={languages.find((lang) => lang.code === language)?.flag}
          alt="Selected Language Flag"
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>{languages.find((lang) => lang.code === language)?.name}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-10 z-50 space-y-2 bg-white border border-gray-300 rounded-lg shadow-lg py-2 px-4 w-48">
          {languages.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-full
                ${language === code ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
            >
              <Image
                src={flag}
                alt={`${name} flag`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
