import { NO_QUESTION_INDEX, NO_VOTE_INDEX } from '../constants';
import { RootState } from '../stores/store';
import { AnswerData } from '../types/DataTypes';

export const selectQuestion = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;

  if (questions === null || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }
  
  return questions[questionIndex];
}



export const selectChosenAnswer = (state: RootState, questionIndex: number): AnswerData | null => {
  const user = state.user;
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (user.username === null || questions === null || votes === null || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }

  const question = questions[questionIndex];
  const currentVotes = user.isAdmin ? votes.admins[user.username] : votes.users[user.username];

  if (!currentVotes) {
    return null;
  }

  const vote = currentVotes[questionIndex];

  if (vote === NO_VOTE_INDEX) {
    return null;
  }

  return {
    index: questionIndex,
    value: question.options[vote],
  };
}



export const selectCorrectAnswer = (state: RootState, questionIndex: number): AnswerData | null => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const status = quiz.status.data;

  if (questions === null || status === null || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }
  
  const question = questions[questionIndex];

  return {
    index: question.answer,
    value: question.options[question.answer],
  };
}



export const selectVoteCount = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;
  
  const votes = quiz.votes.data;
  const players = quiz.players.data;
  
  if (votes === null || players === null || players.length === 0 || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }

  // FIXME: only regular users are considered
  const allUserVotes = Object.values(votes.users);
  return allUserVotes
    .map((userVotes: number[]) => userVotes[questionIndex])
    .filter((vote) => vote !== NO_VOTE_INDEX)
    .length;
}



export const selectHaveAllPlayersAnswered = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;
  
  const status = quiz.status.data;
  const votes = quiz.votes.data;
  const players = quiz.players.data;

  const voteCount = selectVoteCount(state, questionIndex);
  
  if (status === null || votes === null || players === null || players.length === 0 || voteCount === null || questionIndex === NO_QUESTION_INDEX) {
    return false;
  }

  return voteCount === players.length;
}