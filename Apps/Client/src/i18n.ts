import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { DEBUG, QUIZ_NAME, SERVER_ROOT } from './config';
import { Language, QuizName } from './constants';

export const INIT_LANGUAGE = QUIZ_NAME === QuizName.KonnyUndJohannes ? Language.DE : Language.EN;
export const FALLBACK_LANGUAGE = QUIZ_NAME === QuizName.KonnyUndJohannes ? Language.DE : Language.EN;

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: DEBUG,
    lng: INIT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    ns: ['common', QuizName.Liquors, QuizName.KonnyUndJohannes],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${SERVER_ROOT}/static/locales/{{lng}}/{{ns}}.json`,
    },
  });

export default i18n;