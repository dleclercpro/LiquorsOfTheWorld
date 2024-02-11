import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import Overlay from './components/Overlay';
import { useContext, useEffect } from 'react';
import AppContext from './contexts/AppContext';
import { CallGetQuiz } from './calls/data/CallGetQuiz';
import { CallGetUser } from './calls/auth/CallGetUser';
import { User } from './types/UserTypes';
import { Quiz } from './types/QuizTypes';

function App() {
  const { setQuiz, setQuestionIndex } = useContext(AppContext);

  useEffect(() => {
    const fetchQuizData = async () => {
      const { data } = await new CallGetQuiz().execute();

      return data! as Quiz;
    }

    const fetchUserData = async () => {
      const { data } = await new CallGetUser().execute();

      return data! as User;
    }

    fetchQuizData()
      .then((data) => {
        setQuiz(data ?? []);
      });

    fetchUserData()
      .then(({ questionIndex }) => {
        console.log(`Question index: ${questionIndex}`);
        setQuestionIndex(questionIndex);
      });

  }, []);

  return (
    <Router>
        <div className='app'>
          <Overlay />
          <div className='app-container'>
            <Routes>
              <Route path='/quiz' element={<QuizPage />} />
              <Route path='/scores' element={<ScoresPage />} />
              <Route path='/' element={<LoginPage />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </div>
        </div>
    </Router>
  );
}

export default App;