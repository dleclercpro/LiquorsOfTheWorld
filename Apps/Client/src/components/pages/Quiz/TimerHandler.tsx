import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';
import useTimerContext from '../../contexts/TimerContext';
import { NO_QUESTION_INDEX } from '../../../constants';

const TimerHandler: React.FC = () => {  
  const quiz = useQuiz();
  const timer = useTimerContext();
  
  const hasTimerQuestionIndex = quiz.status?.timer?.questionIndex !== undefined;
  const timerQuestionIndex =  hasTimerQuestionIndex ? quiz.status!.timer!.questionIndex : NO_QUESTION_INDEX;

  // FIXME: what if every user is answering at their own pace? Then server timer does not make sense!
  const shouldStartTimer = quiz.isStarted && timer.isEnabled && !timer.isRunning && !timer.isDone;
  const shouldRestartTimer = quiz.isStarted && timer.isEnabled && timerQuestionIndex !== NO_QUESTION_INDEX;

  useEffect(() => {
    if (shouldStartTimer) {
      timer.start();
    }
  }, [shouldStartTimer]);

  useEffect(() => {
    if (shouldRestartTimer) {
      timer.restart();
    }
  }, [timerQuestionIndex]);

  return null;
}

export default TimerHandler;