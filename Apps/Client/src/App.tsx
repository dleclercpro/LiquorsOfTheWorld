import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import { DEBUG, SERVER_ROOT } from './config';
import TestPage from './pages/TestPage';
import AuthRoute from './routes/AuthRoute';
import LoadingOverlay from './components/overlays/LoadingOverlay';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from './hooks/redux';
import { ping } from './actions/AuthActions';
import Nav from './components/Nav';
import ErrorPage from './pages/ErrorPage';
import { updateVersion } from './actions/AppActions';
import { fetchQuizNames } from './actions/DataActions';
import { CallGetBackgroundUrl } from './calls/data/CallGetBackgroundUrl';

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState('');

  const dispatch = useDispatch();

  const quiz = useSelector((state) => state.quiz)

  useEffect(() => {
    dispatch(ping());

    dispatch(updateVersion());
    dispatch(fetchQuizNames());
  }, []);

  useEffect(() => {
    if (quiz.name === null) {
      return;
    }

    new CallGetBackgroundUrl(quiz.name).execute()
      .then(({ data: path }) => {
        const url = `${SERVER_ROOT}${path}`;
        setBackgroundUrl(`url(${url})`);
      })
      .catch((err) => console.error(err));

  }, [quiz.name]);

  return (
    <div className='app' style={{ backgroundImage: backgroundUrl }}>
      <div className='app-container'>
        <Nav />

        <Routes>
          {/* Debugging routes */}
          {DEBUG && (
            <>
              <Route path='/test' element={(
                <TestPage />
              )} />
            </>
          )}

          <Route path='/quiz' element={(
            <AuthRoute>
              <QuizPage />
            </AuthRoute>
          )} />
          <Route path='/scores' element={(
            <AuthRoute>
              <ScoresPage />
            </AuthRoute>
          )} />
          <Route path='/error' element={(
            <ErrorPage />
          )} />
          <Route path='/' element={(
            <HomePage />
          )} />

          {/* Error route */}
          <Route path='*' element={(
            <Navigate to='/error' />
          )} />
        </Routes>
        
        <LoadingOverlay />
        <AnswerOverlay />
      </div>
    </div>
  );
}

export default App;