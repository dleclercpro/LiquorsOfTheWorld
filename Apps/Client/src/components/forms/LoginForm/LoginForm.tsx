import React, { useEffect, useState } from 'react';
import { useDispatch } from '../../../hooks/ReduxHooks';
import './LoginForm.scss';
import { loginAction } from '../../../actions/UserActions';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../../hooks/useQuiz';
import useUser from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { PageUrl } from '../../../constants';

type Props = {
  quizId: string | null,
  teamId: string | null,
  hideQuizId?: boolean,
  hideTeamId?: boolean,
}

const LoginForm: React.FC<Props> = (props) => {
  const { hideQuizId, hideTeamId } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const quiz = useQuiz();
  const { isAuthenticated, error, setError } = useUser();

  const [quizId, setQuizId] = useState('');
  const [teamId, setTeamId] = useState('');

  const disableQuizId = !!props.quizId;
  const disableTeamId = !!props.teamId;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = quiz.name !== null && quizId !== null && teamId !== null && username !== null && password !== null;



  // Use props to fill fields
  useEffect(() => {
    setQuizId(props.quizId ?? '');
  }, [props.quizId]);

  useEffect(() => {
    setTeamId(props.teamId ?? '');
  }, [props.teamId]);



  // Redirect to quiz page on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PageUrl.Quiz);
    }
  }, [isAuthenticated]);


  
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



  const handleQuizIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    setError('');

    setQuizId(e.target.value);
  }



  const handleTeamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    setError('');
    
    setTeamId(e.target.value);
  }



  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    setError('');
    
    setUsername(e.target.value);
  }



  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    setError('');
    
    setPassword(e.target.value);
  }



  return (
    <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
      {!hideQuizId && (
        <input
          id='login-quiz-id'
          className={`${disableQuizId ? 'is-disabled' : ''}`}
          type='text'
          value={disableQuizId ? '' : quizId}
          disabled={disableQuizId}
          placeholder={disableQuizId ? `${t(`common:COMMON:QUIZ`)} ID: ${quizId}` : t('common:FORMS.LOGIN.QUIZ_ID')}
          onChange={handleQuizIdChange}
          required
        />
      )}

      {!hideTeamId && (
        <input
          id='login-team-id'
          className={`${disableTeamId ? 'is-disabled' : ''}`}
          type='text'
          value={disableTeamId ? '' : teamId}
          disabled={disableTeamId}
          placeholder={disableTeamId ? `${t(`common:COMMON:TEAM`)} ID: ${teamId}` : t('common:FORMS.LOGIN.TEAM_ID')}
          onChange={handleTeamIdChange}
          required
        />
      )}

      <input
        id='login-username'
        type='text'
        value={username}
        placeholder={t('common:FORMS.LOGIN.USERNAME')}
        onChange={handleUsernameChange}
        required
      />

      <input
        id='login-password'
        type='password'
        value={password}
        placeholder={t('common:FORMS.LOGIN.PASSWORD')}
        onChange={handlePasswordChange}
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