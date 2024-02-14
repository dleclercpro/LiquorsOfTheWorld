import React, { useState } from 'react';
import './HamburgerMenu.scss';
import { CallLogOut } from '../../calls/auth/CallLogOut';

type HamburgerMenuProps = {

}

const HamburgerMenu: React.FC<HamburgerMenuProps> = (props) => {
  const [menuClass, setMenuClass] = useState('hamburger-menu-content hidden');
  
  const showMenu = () => {
    setMenuClass(menuClass.replace('hidden', 'visible'));
  }

  const hideMenu = () => {
    setMenuClass(menuClass.replace('visible', 'hidden'));
  }

  const toggleMenu = () => {
    if (menuClass.includes('hidden')) {
      showMenu();
    } else {
      hideMenu();
    }
  }

  const logout = async () => {
    await new CallLogOut().execute();
  }

  const handleClickOnMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    toggleMenu();
  }

  return (
    <div className='hamburger-menu' onClick={handleClickOnMenu}>
      <div className='hamburger-menu-icon'>
        &#9776;
      </div>
      <div className={menuClass}>
        <a href='/' onClick={() => logout()}>Log out</a>
      </div>
    </div>
  );
}

export default HamburgerMenu;