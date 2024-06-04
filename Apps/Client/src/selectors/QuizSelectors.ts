import { NO_QUESTION_INDEX, NO_VOTE_INDEX } from '../constants';
import { RootState } from '../stores/store';

export const selectQuestion = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;

  if (questions === null || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }
  
  return questions[questionIndex];
}



export const selectAnswer = (state: RootState, questionIndex: number) => {
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
  const answer = vote !== NO_VOTE_INDEX ? question.options[vote] : null;

  return answer;
}



export const selectCorrectAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const status = quiz.status.data;

  if (questions === null || status === null || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }
  
  const question = questions[questionIndex];
  const correctAnswer = question.options[question.answer];

  return correctAnswer;
}



export const haveAllPlayersAnswered = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;
  
  const status = quiz.status.data;
  const votes = quiz.votes.data;
  const players = quiz.players.data;
  
  if (status === null || votes === null || players === null || players.length === 0 || questionIndex === NO_QUESTION_INDEX) {
    return false;
  }

  const { voteCounts } = status;

  return voteCounts[questionIndex] === players.length;
}