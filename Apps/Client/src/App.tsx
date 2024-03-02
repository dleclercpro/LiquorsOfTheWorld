import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import { DEBUG } from './config';
import TestPage from './pages/TestPage';
import AuthRoute from './routes/AuthRoute';
import LoadingOverlay from './components/overlays/LoadingOverlay';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { useEffect } from 'react';
import { useDispatch } from './hooks/redux';
import { ping } from './actions/UserActions';

function App() {
  const dispatch = useDispatch();
  
  // Check if user is logged in already
  useEffect(() => {
    dispatch(ping());
  }, []);

  return (
    <div className='app'>
      <Routes>
        {DEBUG && (
          <Route path='/test' element={(
            <TestPage />
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
        <Route path='/:quizId' element={(
          <HomePage />
        )} />
        <Route path='/' element={(
          <HomePage />
        )} />
        <Route path='*' element={(
          <Navigate to='/' />
        )} />
      </Routes>
      
      <LoadingOverlay />
      <AnswerOverlay />
    </div>
  );
}

export default App;