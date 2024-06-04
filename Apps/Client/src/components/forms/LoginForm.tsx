import React, { useEffect, useState } from 'react';
import { useDispatch } from '../../hooks/ReduxHooks';
import './LoginForm.scss';
import { loginAction } from '../../actions/UserActions';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../hooks/useQuiz';
import useUser from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

type Props = {
  quizId: string | null,
  teamId: string | null,
}

const LoginForm: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const quiz = useQuiz();
  const user = useUser();

  const [quizId, setQuizId] = useState('');
  const [teamId, setTeamId] = useState('');

  const disableQuizId = !!props.quizId;
  const disableTeamId = !!props.teamId;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = quiz.name !== null && quizId !== '' && teamId !== '' && username !== '' && password !== '';



  // Use props to fill fields
  useEffect(() => {
    setQuizId(props.quizId ?? '');
  }, [props.quizId]);

  useEffect(() => {
    setTeamId(props.teamId ?? '');
  }, [props.teamId]);



  // Redirect to quiz page on successful login
  useEffect(() => {
    if (user.isAuthenticated) {
      navigate(`/quiz`);
    }
  }, [user.isAuthenticated]);


  
  // Send login data to server
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    const auth = { username, password };

    await dispatch(loginAction({
      ...auth,
      quizName: quiz.name!,
      quizId,
      teamId,
    }));
  };



  return (
    <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
      <input
        id='login-quiz-id'
        className={`${disableQuizId ? 'is-disabled' : ''}`}
        type='text'
        value={disableQuizId ? '' : quizId}
        disabled={disableQuizId}
        placeholder={disableQuizId ? `${t(`common:COMMON:QUIZ`)} ID: ${quizId}` : t('common:FORMS.LOGIN.QUIZ_ID')}
        onChange={(e) => setQuizId(e.target.value)}
        required
      />

      <input
        id='login-team-id'
        className={`${disableTeamId ? 'is-disabled' : ''}`}
        type='text'
        value={disableTeamId ? '' : teamId}
        disabled={disableTeamId}
        placeholder={disableTeamId ? `${t(`common:COMMON:TEAM`)} ID: ${teamId}` : t('common:FORMS.LOGIN.TEAM_ID')}
        onChange={(e) => setTeamId(e.target.value)}
        required
      />

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

      {user.error && (
        <p className='login-error'>
          {t(`ERRORS.${user.error}`)}
        </p>
      )}

      <button className={`login-button ${!canSubmit ? 'is-disabled' : ''}`} type='submit' disabled={!canSubmit}>
        {t('common:FORMS.LOGIN.SUBMIT')}
      </button>
    </form>
  );
};

export default LoginForm;