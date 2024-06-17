import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';
import useOverlay from '../../../hooks/useOverlay';
import { OverlayName } from '../../../reducers/OverlaysReducer';
import useTimerContext from '../../contexts/TimerContext';

const AnswerOverlayHandler: React.FC = () => {  
  const quiz = useQuiz();
  const timer = useTimerContext();
  const answerOverlay = useOverlay(OverlayName.Answer);

  const shouldShowAnswer = timer.isEnabled && timer.isDone && quiz.isStarted;

  useEffect(() => {
    if (shouldShowAnswer && !answerOverlay.isOpen) {
      answerOverlay.open();
    }

    if (!shouldShowAnswer && answerOverlay.isOpen) {
      answerOverlay.close();
    }

  }, [shouldShowAnswer]);

  return null;
}

export default AnswerOverlayHandler;