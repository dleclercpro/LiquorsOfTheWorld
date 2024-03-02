import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import { DEBUG } from './config';
import { Language } from './constants';

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};

i18n
  .use(initReactI18next)
  .init({
    debug: DEBUG,
    resources,
    lng: Language.EN,         // Initial language
    fallbackLng: Language.EN, // Default fallback language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;