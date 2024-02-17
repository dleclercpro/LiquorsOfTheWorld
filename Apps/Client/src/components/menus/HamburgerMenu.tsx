import React, { useState } from 'react';
import './HamburgerMenu.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { logout } from '../../reducers/UserReducer';
import { Link, useLocation } from 'react-router-dom';

const HamburgerMenu: React.FC = () => {
  const location = useLocation();

  const quizId = useSelector((state) => state.quiz.id);

  const [shouldShow, setShouldShow] = useState(false);

  const dispatch = useDispatch();
  
  const showMenu = () => {
    setShouldShow(true);
  }

  const hideMenu = () => {
    setShouldShow(false);
  }

  const toggleMenu = () => {
    shouldShow ? hideMenu() : showMenu();
  }

  const handleClickOnMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    toggleMenu();
  }

  if (quizId === null) {
    return null;
  }

  return (
    <div className='hamburger-menu' onClick={handleClickOnMenu}>
      <div className='hamburger-menu-icon'>
        &#9776;
      </div>
      <div className={`hamburger-menu-content ${shouldShow ? 'visible' : 'hidden'}`}>
        <ul>
          {location.pathname !== '/quiz' && (
            <li>
              <Link to={`/quiz`}>Quiz</Link>
            </li>
          )}
          {location.pathname !== '/scores' && (
            <li>
              <Link to={`/scores`}>Scoreboard</Link>
            </li>
          )}
          <li>
          </li>
          <li>
            <Link to='/' onClick={() => dispatch(logout())}>Log out</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HamburgerMenu;