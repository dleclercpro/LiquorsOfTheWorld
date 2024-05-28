import { useTranslation } from 'react-i18next';
import { useSelector } from './useRedux';

const useApp = () => {
  const { version, language, questionIndex, styles } = useSelector(({ app }) => app);

  const { i18n } = useTranslation();
  const { changeLanguage } = i18n;

  return {
    version,
    language,
    playerQuestionIndex: questionIndex,
    styles,
    changeLanguage,
  };
};

export default useApp;