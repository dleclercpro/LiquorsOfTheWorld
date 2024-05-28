import { RootState } from '../stores/store';

export const selectQuestion = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (!questions || !votes) {
    return null;
  }
  
  return questions[questionIndex];
}

export const selectAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (!questions || !votes || votes.length < questionIndex + 1) {
    return null;
  }
  
  const question = questions[questionIndex];
  const vote = votes[questionIndex];
  const answer = question.options[vote];

  return answer;
}

export const selectCorrectAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;

  if (!questions) {
    return null;
  }
  
  const question = questions[questionIndex];
  const correctAnswer = question.options[question.answer];

  return correctAnswer;
}

export const selectVote = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (!questions || !votes || votes.length < questionIndex + 1) {
    return {
      voteIndex: null,
      vote: null,
    };
  }
  
  const question = questions[questionIndex];
  const voteIndex = votes[questionIndex];
  const vote = question.options[voteIndex];

  return {
    voteIndex,
    vote,
  };
}

export const haveAllPlayersAnswered = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;
  
  const status = quiz.status.data;
  const votes = quiz.votes.data;
  const players = quiz.players.data;
  
  if (!status || !votes || !players || players.length === 0) {
    return false;
  }

  const { voteCounts } = status;

  return voteCounts[questionIndex] === players.length;
}