import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import Overlay from './components/Overlay';
import { useContext, useEffect } from 'react';
import AppContext from './states/AppContext';
import { CallGetQuiz } from './calls/data/CallGetQuiz';

function App() {
  const { currentQuestionId, quizData, setQuizData } = useContext(AppContext);

  useEffect(() => {
    const fetchQuizData = async () => {
      const { data } = await new CallGetQuiz().execute();

      return data;
    }

    fetchQuizData().then((data) => {
      setQuizData(data ?? []);
    });
  }, [quizData, setQuizData]);

  if (quizData.length === 0) {
    return null;
  }

  const { theme, question, options } = quizData[currentQuestionId];

  return (
    <Router>
        <div className='app'>
          <Overlay />
          <div className='app-container'>
            <Routes>
              <Route path='/quiz' element={
                <QuizPage
                  id={currentQuestionId}
                  theme={theme}
                  question={question}
                  options={options}
                />}
              />
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