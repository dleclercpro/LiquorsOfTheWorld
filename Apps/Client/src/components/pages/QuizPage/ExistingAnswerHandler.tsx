import React, { useEffect, useState } from 'react';
import useOverlay from '../../../hooks/useOverlay';
import useQuestion from '../../../hooks/useQuestion';
import { OverlayName } from '../../../reducers/OverlaysReducer';
import useApp from '../../../hooks/useApp';

const ExistingAnswerHandler: React.FC = () => {  
  const [choice, setChoice] = useState('');

  const app = useApp();

  const { questionIndex } = app;

  const question = useQuestion(questionIndex);
  const answerOverlay = useOverlay(OverlayName.Answer);

  useEffect(() => {
    if (question.answer.chosen === null) {
      if (answerOverlay.isOpen) {
        answerOverlay.close();
      }
      return;
    }

    if (choice !== question.answer.chosen.value) {
      setChoice(question.answer.chosen.value);

      if (!answerOverlay.isOpen) {
        answerOverlay.open();
      }
    }

  }, [question.answer.chosen]);

  return null;
}

export default ExistingAnswerHandler;