import { useTranslation } from 'react-i18next';
import { useSelector } from './ReduxHooks';

const useApp = () => {
    // Note: no new instances will be created, since the props are directly derived
  // from the root state
  const { version, language, questionIndex, styles } = useSelector(({ app }) => app);

  const { i18n } = useTranslation();
  const { changeLanguage } = i18n;

  return {
    version,
    language,
    questionIndex,
    styles,
    changeLanguage,
  };
};

export default useApp;