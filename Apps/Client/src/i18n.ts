import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import { DEBUG, QUIZ } from './config';
import { Language, QuizName } from './constants';

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};

export const INIT_LANGUAGE = QUIZ === QuizName.KonnyUndJohannes ? Language.DE : Language.EN;
export const FALLBACK_LANGUAGE = Language.EN;

i18n
  .use(initReactI18next)
  .init({
    debug: DEBUG,
    resources,
    lng: INIT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;