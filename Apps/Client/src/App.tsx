import React from 'react'; // Do not remove!
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/quiz' element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;