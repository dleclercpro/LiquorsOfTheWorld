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
import Nav from './components/Nav';
import ErrorPage from './pages/ErrorPage';
import { updateBackgroundAction } from './actions/AppActions';
import { fetchInitialDataAction } from './actions/DataActions';
import useQuiz from './hooks/useQuiz';
import useUser from './hooks/useUser';
import useApp from './hooks/useApp';
import LobbyOverlay from './components/overlays/LobbyOverlay';
import QuizzesPage from './pages/QuizzesPage';

function App() {
  const dispatch = useDispatch();

  const app = useApp();
  const user = useUser();
  const quiz = useQuiz();
  
  // Load initial app data from server and hide
  // loading screen once done
  useEffect(() => {
    dispatch(fetchInitialDataAction());
  }, []);

  // Set app background once quiz name is known
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

          <Route path='/quizzes' element={(
            <QuizzesPage />
          )} />

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
        <LobbyOverlay />
        <AnswerOverlay />
      </div>
    </div>
  );
}

export default App;