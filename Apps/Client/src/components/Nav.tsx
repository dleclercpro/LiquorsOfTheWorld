import React, { useEffect, useRef, useState } from 'react';
import './Nav.scss';
import { useDispatch, useSelector } from '../hooks/redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../actions/UserActions';
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

const NavMenu: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = i18n;

  const [lang, setLang] = useState(language);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const status = useSelector((state) => state.quiz.status.data);
  const user = useSelector((state) => state.user);

  // Change language in i18n when it is changed in the component's state
  useEffect(() => {
    changeLanguage(lang);
  }, [lang]);

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
    if (lang === Language.EN) {
      setLang(Language.DE);
    } else {
      setLang(Language.EN);
    }
  }

  const handleClickOnButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    setIsOpen(!isOpen);
  }

  const handleLanguageSwitch = () => {
    toggleLanguage();
  }

  const { username } = user;
  const isAuthenticated = username !== null;
  const isStarted = status?.isStarted;

  const Icon = isOpen ? CloseIcon : OpenIcon;

  return (
    <nav className='nav' ref={menuRef}>
      <button className='nav-button' onClick={handleClickOnButton}>
        <Icon className='nav-button-icon' />
      </button>
      <section className={`nav-content ${isOpen ? 'visible' : 'hidden'}`}>
        <ul>
          <li>
            <p>
              <strong className='nav-username'>
                {isAuthenticated ? username : `${t('COMMON.WELCOME')}!`}
              </strong>
            </p>
          </li>

          <li>
            <button onClick={handleLanguageSwitch}>
              {language === Language.EN ? (
                <>
                  Deutsch
                  <GermanyIcon className='nav-link-icon flag' />
                </>
                ) : (
                <>
                  English
                  <UnitedKingdoIcon className='nav-link-icon flag' />
                </>
              )}
            </button>
          </li>

          {location.pathname !== '/quiz' && isAuthenticated && (
            <li>
              <Link to={`/quiz`}>
                {t('COMMON.QUIZ')}
                <QuizIcon className='nav-link-icon' />
              </Link>
            </li>
          )}

          {location.pathname !== '/scores' && isAuthenticated && isStarted && (
            <li>
              <Link to={`/scores`}>
                {t('COMMON.SCOREBOARD')}
                <ScoreboardIcon className='nav-link-icon' />
              </Link>
            </li>
          )}

          {DEBUG && location.pathname !== '/test' && (
            <li>
              <Link to={`/test`}>
                {t('COMMON.TEST')}
                <SettingsIcon className='nav-link-icon' />
              </Link>
            </li>
          )}

          {DEBUG && location.pathname === '/test' && (
            <li>
              <Link to={`/`}>
                {t('COMMON.START_PAGE')}
                <HomeIcon className='nav-link-icon' />
              </Link>
            </li>
          )}

          {isAuthenticated && (
            <li>
              <Link to='/' onClick={() => dispatch(logout())}>
                {t('COMMON.LOG_OUT')}
                <LogoutIcon className='nav-link-icon' />
              </Link>
            </li>
          )}
        </ul>
      </section>
    </nav>
  );
}

export default NavMenu;