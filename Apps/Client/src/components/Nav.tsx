import React, { useEffect, useRef, useState } from 'react';
import './Nav.scss';
import { useDispatch } from '../hooks/ReduxHooks';
import { Link, useLocation } from 'react-router-dom';
import OpenIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import QuizIcon from '@mui/icons-material/Quiz';
import { ReactComponent as GermanyIcon } from '../icons/germany.svg';
import { ReactComponent as UnitedKingdoIcon } from '../icons/uk.svg';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { useTranslation } from 'react-i18next';
import { DEBUG } from '../config';
import { Language } from '../constants';
import { setLanguage } from '../reducers/AppReducer';
import useUser from '../hooks/useUser';
import useQuiz from '../hooks/useQuiz';
import useApp from '../hooks/useApp';

const Nav: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { t } = useTranslation();

  const app = useApp();
  
  const [appLanguage, setAppLanguage] = useState(app.language as Language);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const quiz = useQuiz();
  const user = useUser();

  // Change language in i18n when it is changed in the component's state
  useEffect(() => {
    app.changeLanguage(appLanguage);
    dispatch(setLanguage(appLanguage));
  
  }, [appLanguage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Add event listener when the menu is open
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      // Clean up the event listener when the component unmounts or when the menu is closed
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  const toggleLanguage = () => {
    if (appLanguage === Language.EN) {
      setAppLanguage(Language.DE);
    } else {
      setAppLanguage(Language.EN);
    }
  }

  const open = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    setIsOpen(true);
  }

  const close = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    setIsOpen(false);
  }

  const handleLanguageSwitch = () => {
    toggleLanguage();
  }

  const handleLogout = () => {
    setIsOpen(false);

    user.logout();
  }

  return (
    <nav className='nav' ref={menuRef}>
      <button className='nav-button' onClick={open}>
        <OpenIcon className='nav-button-icon' />
      </button>

      <section className={`nav-content ${isOpen ? 'visible' : 'hidden'}`}>
        <ul>
          <li className='nav-first-item'>
            <button className='nav-button' onClick={close}>
              <CloseIcon className='nav-icon' />
            </button>
            <p className='nav-text'>
              <strong className='nav-username'>
                {user.isAuthenticated ? `${t('common:COMMON.WELCOME')}, ${user.username}!` : `${t('common:COMMON.WELCOME')}!`}
              </strong>
            </p>
          </li>

          <li className='nav-item'>
            <button className='nav-button' onClick={handleLanguageSwitch}>
              {app.language === Language.EN ? (
                <>
                  <GermanyIcon className='nav-icon flag' />
                  Deutsch
                </>
                ) : (
                <>
                  <UnitedKingdoIcon className='nav-icon flag' />
                  English
                </>
              )}
            </button>
          </li>

          {location.pathname !== '/quiz' && user.isAuthenticated && (
            <li className='nav-item'>
              <Link className='nav-link' to={`/quiz`}>
                <QuizIcon className='nav-icon' />
                {t('common:COMMON.QUIZ')}
              </Link>
            </li>
          )}

          {location.pathname !== '/scores' && user.isAuthenticated && quiz.isStarted && (
            <li className='nav-item'>
              <Link className='nav-link' to={`/scores`}>
                <ScoreboardIcon className='nav-icon' />
                {t('common:COMMON.SCOREBOARD')}
              </Link>
            </li>
          )}

          {DEBUG && location.pathname === '/admin' && !user.isAuthenticated && (
            <li className='nav-item'>
              <Link className='nav-link' to={`/`}>
                <HomeIcon className='nav-icon' />
                {t('common:COMMON.HOMEPAGE')}
              </Link>
            </li>
          )}

          {!user.isAuthenticated && (
            <li className='nav-item'>
              <Link className='nav-link' to={`/quizzes`}>
                <QuizIcon className='nav-icon' />
                {t('common:COMMON.QUIZZES')}
              </Link>
            </li>
          )}

          {/* This nav item will only appear in debug mode! */}
          {DEBUG && location.pathname !== '/admin' && (
            <li className='nav-item'>
              <Link className='nav-link' to={`/admin`}>
                <SettingsIcon className='nav-icon' />
                {t('common:COMMON.ADMIN')}
              </Link>
            </li>
          )}

          {user.isAuthenticated && (
            <li className='nav-item'>
              <Link className='nav-link' to='/' onClick={handleLogout}>
                <LogoutIcon className='nav-icon' />
                {t('common:COMMON.LOG_OUT')}
              </Link>
            </li>
          )}
        </ul>
      </section>
    </nav>
  );
}

export default Nav;