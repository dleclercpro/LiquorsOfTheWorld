import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';
import useOverlay from '../../../hooks/useOverlay';
import { OverlayName } from '../../../reducers/OverlaysReducer';

const QuizCompletionHandler: React.FC = () => {  
  const quiz = useQuiz();
  const answerOverlay = useOverlay(OverlayName.Answer);

  useEffect(() => {
    if (quiz.isOver && !answerOverlay.isOpen) {
      answerOverlay.open();
    }
  }, [quiz.isOver, answerOverlay.isOpen]);

  return null;
}

export default QuizCompletionHandler;