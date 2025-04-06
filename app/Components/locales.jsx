'use client';

import { useState, useEffect } from 'react';
import { GB, RU, UZ } from 'country-flag-icons/react/1x1';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'uz', name: "O'zbekcha", flag: <UZ title="" className="h-6 w-8" /> },
  { code: 'en', name: 'English', flag: <GB title="" className="h-6 w-8" /> },
  { code: 'ru', name: 'Русский', flag: <RU title="" className="h-6 w-8" /> },
];

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
    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 mb-20 z-50">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-2 py-2 rounded-md text-xs font-medium bg-white text-gray-700 hover:bg-gray-300 transition-all duration-300"
      >
        {languages.find((lang) => lang.code === language)?.flag}
        {/* <Image
          src={languages.find((lang) => lang.code === language)?.flag}
          alt="Selected Language Flag"
          width={24}
          height={24}
          className="rounded-full"
        /> */}
        <span>{languages.find((lang) => lang.code === language)?.name}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-10 left-0 z-50 space-y-2 bg-white border border-gray-300 rounded-lg shadow-lg py-2 px-2 max-w-max">
          {languages.map(({ code, name, flag }) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`flex items-center space-x-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 w-full
                ${language === code ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-300'}
              `}
            >
              {flag}
              {/* <Image
                src={flag}
                alt={`${name} flag`}
                width={24}
                height={24}
                className="rounded-full"
              /> */}
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
