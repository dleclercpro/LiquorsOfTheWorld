import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import { DEBUG } from './config';

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
    lng: 'de',         // Initial language
    fallbackLng: 'en', // Default fallback language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;