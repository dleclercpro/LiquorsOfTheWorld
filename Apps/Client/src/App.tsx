import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import { DEBUG } from './config';
import AdminPage from './pages/AdminPage';
import AuthRoute from './routes/AuthRoute';
import LoadingOverlay from './components/overlays/LoadingOverlay';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { useEffect } from 'react';
import { useDispatch } from './hooks/ReduxHooks';
import { pingAction } from './actions/UserActions';
import Nav from './components/Nav';
import ErrorPage from './pages/ErrorPage';
import { updateBackgroundAction, updateVersionAction } from './actions/AppActions';
import { fetchQuizNamesAction } from './actions/DataActions';
import useQuiz from './hooks/useQuiz';
import useUser from './hooks/useUser';
import useApp from './hooks/useApp';

function App() {
  const dispatch = useDispatch();

  const app = useApp();
  const user = useUser();
  const quiz = useQuiz();

  useEffect(() => {
    dispatch(pingAction());
    dispatch(updateVersionAction());
    dispatch(fetchQuizNamesAction());
  }, []);

  useEffect(() => {
    if (quiz.name === null) {
      return;
    }

    dispatch(updateBackgroundAction());

  }, [quiz.name]);
  
  return (
    <div className='app' style={{ backgroundImage: `url(${app.styles.bg})` }}>
      <div className='app-container'>
        <Nav />

        <Routes>
          {(DEBUG || user.isAdmin) && (
            <Route path='/admin' element={(
              <AdminPage />
            )} />
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