import React from 'react';
import './QuestionFormMeta.scss';
import { useTranslation } from 'react-i18next';
import { QUIZ_TIMER_URGENT_TIME } from '../../../config';
import { NO_TIME } from '../../../constants';
import TimeDuration from '../../../models/TimeDuration';
import { TimeUnit } from '../../../types/TimeTypes';

type Props = {
  questionIndex: number,
  questionsCount: number,
  topic: string,
  remainingTime?: TimeDuration,
}

const QuestionFormMeta: React.FC<Props> = (props) => {
  const { questionIndex, questionsCount, topic, remainingTime } = props;

  const { t } = useTranslation();

  return (
    <section className='question-form-meta'>
      {remainingTime && (
        <p className={`
          question-form-timer
          ${remainingTime.smallerThanOrEquals(QUIZ_TIMER_URGENT_TIME) ? 'urgent' : ''}
          ${remainingTime.equals(NO_TIME) ? 'done' : ''}
        `}>
          {t('common:COMMON.TIME_LEFT')}:
          <span className='question-form-timer-value'>
            {remainingTime.format(TimeUnit.Second)}
          </span>
        </p>
      )}
      <p className='question-form-index'>
        {t('common:COMMON.QUESTION')}:
        <span className='question-form-index-value'>
          {questionIndex + 1}/{questionsCount}
        </span>
      </p>
      <p className='question-form-topic'>
        {t('common:COMMON.TOPIC')}:
        <span className='question-form-topic-value'>
          {topic}
        </span>
      </p>
    </section>
  );
};

export default QuestionFormMeta;
