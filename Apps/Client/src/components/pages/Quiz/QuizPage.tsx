import React, { useState } from 'react';
import './QuizPage.scss';
import QuestionForm from '../../forms/QuestionForm';
import AdminQuizForm from '../../forms/AdminQuizForm';
import { useTranslation } from 'react-i18next';
import { AspectRatio, Language, QuestionType } from '../../../constants';
import Page from '../Page';
import useQuiz from '../../../hooks/useQuiz';
import useUser from '../../../hooks/useUser';
import useApp from '../../../hooks/useApp';
import useQuestion from '../../../hooks/useQuestion';
import LoadingOverlayHandler from './LoadingOverlayHandler';
import InitialDataFetcher from './InitialDataFetcher';
import LanguageChangeHandler from './LanguageChangeHandler';
import StatusRefresher from './StatusRefresher';
import RepeatedStatusRefresher from './RepeatedStatusRefresher';
import ExistingAnswerHandler from './ExistingAnswerHandler';
import QuizCompletionHandler from './QuizCompletionHandler';
import TimerHandler from './TimerHandler';
import AnswerOverlayHandler from './AnswerOverlayHandler';
import LobbyOverlayHandler from './LobbyOverlayHandler';
import useTimerContext from '../../contexts/TimerContext';

const QuizPage: React.FC = () => {  
  const { t, i18n } = useTranslation();

  const language = i18n.language as Language;

  const app = useApp();
  const quiz = useQuiz();
  const user = useUser();
  const question = useQuestion(app.questionIndex);

  const timer = useTimerContext();

  const [choice, setChoice] = useState('');

  const isReady = quiz.id !== null && quiz.questions !== null && quiz.status !== null && question !== null && question.data !== null;

  return (
    <Page title={t('common:COMMON:QUIZ')} className='quiz-page'>
      {!quiz.isStarted && user.isAdmin && (
        <AdminQuizForm />
      )}
      {quiz.isStarted && isReady && (
        <QuestionForm
          remainingTime={timer.isEnabled ? timer.time : undefined}
          index={question.index}
          topic={question.data!.topic}
          question={question.data!.question}
          image={question.data!.type === QuestionType.Image ? { url: question.data!.url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          video={question.data!.type === QuestionType.Video ? { url: question.data!.url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          ratio={AspectRatio.FourByThree}
          options={question.data!.options}
          disableSubmit={choice === ''}
          choice={choice}
          setChoice={setChoice}
        />
      )}

      <InitialDataFetcher />
      <LanguageChangeHandler language={language} />

      <StatusRefresher />
      <RepeatedStatusRefresher />

      <ExistingAnswerHandler />
      <QuizCompletionHandler />
      <TimerHandler />

      <LoadingOverlayHandler isReady={isReady} />
      <AnswerOverlayHandler />
      <LobbyOverlayHandler />
    </Page>
  );
}

export default QuizPage;