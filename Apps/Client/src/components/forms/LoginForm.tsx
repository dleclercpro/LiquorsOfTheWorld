import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../hooks/ReduxHooks';
import './LoginForm.scss';
import { loginAction } from '../../actions/UserActions';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../hooks/useQuiz';

type Props = {
  quizId: string | null,
  teamId: string | null,
}

const LoginForm: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const quiz = useQuiz();

  const [quizId, setQuizId] = useState(props.quizId ?? '');
  const [teamId, setTeamId] = useState(props.teamId ?? '');

  const [disableQuizId] = useState(!!props.quizId);
  const [disableTeamId] = useState(!!props.teamId);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const user = useSelector((state) => state.user);

  const canSubmit = quiz.name !== null && quizId !== null && teamId !== null && username !== '' && password !== '';


  
  // FIXME
  // Redirect to current quiz question on successful login
  useEffect(() => {
    if (user.status === 'succeeded' && user.isAuthenticated) {
      navigate(`/quiz`);
    }
  }, [user.status]);

  // Display authentication error to user
  useEffect(() => {
    if (user.status === 'failed' && user.error) {
      setError(user.error);
    }
  }, [user.status, user.error]);



  // Send login data to server
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    await dispatch(loginAction({
      quizName: quiz.name!,
      quizId,
      teamId,
      username,
      password,
    }));
  };

  return (
    <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
      {!props.quizId && (
        <input
          id='login-quiz-id'
          className={`${disableQuizId ? 'is-disabled' : ''}`}
          type='text'
          value={quizId}
          disabled={disableQuizId}
          placeholder={t('common:FORMS.LOGIN.QUIZ_ID')}
          onChange={(e) => setQuizId(e.target.value)}
          required
        />
      )}

      {!props.teamId && (
        <input
          id='login-team-id'
          className={`${disableTeamId ? 'is-disabled' : ''}`}
          type='text'
          value={teamId}
          disabled={disableTeamId}
          placeholder={t('common:FORMS.LOGIN.TEAM_ID')}
          onChange={(e) => setTeamId(e.target.value)}
          required
        />
      )}

      <input
        id='login-username'
        type='text'
        value={username}
        placeholder={t('common:FORMS.LOGIN.USERNAME')}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        id='login-password'
        type='password'
        value={password}
        placeholder={t('common:FORMS.LOGIN.PASSWORD')}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className='login-error'>
          {t(`ERRORS.${error}`)}
        </p>
      )}

      <button className={`login-button ${!canSubmit ? 'is-disabled' : ''}`} type='submit' disabled={!canSubmit}>
        {t('common:FORMS.LOGIN.SUBMIT')}
      </button>
    </form>
  );
};

export default LoginForm;