import { RootState } from '../stores/store';

export const selectPlayers = (state: RootState) => {
    const status = state.quiz.status.data;
  
    if (status === null) {
      return [];
    }
  
    return status.players;
  }
  
  export const selectQuestion = (state: RootState, questionIndex: number) => {
    const quiz = state.quiz;
  
    const questions = quiz.questions.data;
    const votes = quiz.votes.data;
  
    if (questions === null || votes === null) {
      return null;
    }
    
    return questions[questionIndex];
  }
  
  export const selectAnswer = (state: RootState, questionIndex: number) => {
    const quiz = state.quiz;
  
    const questions = quiz.questions.data;
    const votes = quiz.votes.data;
  
    if (questions === null || votes === null) {
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
  
    if (questions === null) {
      return null;
    }
    
    const question = questions[questionIndex];
    const answer = question.options[question.answer];
  
    return answer;
  }
  
  export const selectVote = (state: RootState, questionIndex: number) => {
    const quiz = state.quiz;
  
    const questions = quiz.questions.data;
    const votes = quiz.votes.data;
  
    if (questions === null || votes === null || votes.length < questionIndex + 1) {
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
    const players = selectPlayers(state);
    
    if (status === null || votes === null || players === null) {
      return false;
    }
  
    const { votesCount } = status;
  
    return votesCount[questionIndex] === players.length;
  }