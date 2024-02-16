import React from 'react';
import './ScoresPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import Scoreboard from '../components/boxes/Scoreboard';
import { useParams } from 'react-router-dom';

type RouteParams = {
  quizId: string;
};

const ScoresPage: React.FC = () => {
  const { quizId } = useParams<RouteParams>();

  if (quizId === undefined) {
    return null;
  }
  
  return (
    <React.Fragment>
      <HamburgerMenu />
      <Scoreboard quizId={quizId} />
    </React.Fragment>
  );
};

export default ScoresPage;