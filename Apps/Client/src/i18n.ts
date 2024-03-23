import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { DEBUG, SERVER_ROOT } from './config';
import { Language, QuizName } from './constants';

export const INIT_LANGUAGE = Language.DE;
export const FALLBACK_LANGUAGE = Language.DE;

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