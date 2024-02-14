import React from 'react';
import './ScoresPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import Scoreboard from '../components/boxes/Scoreboard';

const ScoresPage: React.FC = () => {
  return (
    <React.Fragment>
      <HamburgerMenu />
      <Scoreboard />
    </React.Fragment>
  );
};

export default ScoresPage;