import { createSelector } from 'reselect';
import { NO_QUESTION_INDEX, NO_VOTE_INDEX, USER_TYPES, UserType } from '../constants';
import { RootState } from '../stores/store';
import { AnswerData, GroupedVoteCountData } from '../types/DataTypes';

const getQuiz = (state: RootState) => state.quiz;
const getUser = (state: RootState) => state.user;
const getQuestionIndex = (_state: RootState, questionIndex: number) => questionIndex;

export const selectQuestion = createSelector(
  [getQuiz, getQuestionIndex],
  (quiz, questionIndex) => {
    const questions = quiz.questions.data;

    if (questions === null || questionIndex === NO_QUESTION_INDEX) {
      return null;
    }

    const isQuestionIndexValid = 0 <= questionIndex && questionIndex + 1 <= questions.length;
    if (!isQuestionIndexValid) {
      throw new Error('INVALID_QUESTION_INDEX');
    }

    return questions[questionIndex];
  }
);

export const selectChosenAnswer = createSelector(
  [getUser, getQuiz, getQuestionIndex],
  (user, quiz, questionIndex): AnswerData | null => {
    const votes = quiz.votes.data;

    if (user.username === null || votes === null) {
      return null;
    }

    const question = selectQuestion.resultFunc(quiz, questionIndex);
    if (question === null) {
      return null;
    }

    const currentVotes = votes[user.isAdmin ? UserType.Admin : UserType.Regular][user.username];

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
);

export const selectCorrectAnswer = createSelector(
  [getQuiz, getQuestionIndex],
  (quiz, questionIndex): AnswerData | null => {
    const status = quiz.status.data;
    if (status === null) {
      return null;
    }

    const question = selectQuestion.resultFunc(quiz, questionIndex);
    if (question === null) {
      return null;
    }

    return {
      index: question.answer,
      value: question.options[question.answer],
    };
  }
);

export const selectVoteCounts = createSelector(
  [getQuiz, getQuestionIndex],
  (quiz, questionIndex) => {
    const votes = quiz.votes.data;
    const players = quiz.players.data;

    if (votes === null || players === null || players.length === 0 || questionIndex === NO_QUESTION_INDEX) {
      return null;
    }

    const voteCounts: GroupedVoteCountData = {
      [UserType.Admin]: -1,
      [UserType.Regular]: -1,
    };

    for (const userType of USER_TYPES) {
      voteCounts[userType] = Object.values(votes[userType])
          .map((voteIndices: number[]) => voteIndices[questionIndex])
          .filter((voteIndex: number) => voteIndex !== NO_VOTE_INDEX)
          .length;
    }

    return voteCounts;
  }
);

export const selectHaveAllPlayersAnswered = createSelector(
  [getQuiz, getQuestionIndex, (_state: RootState, _questionIndex: number, ignoreAdmins: boolean) => ignoreAdmins],
  (quiz, questionIndex, ignoreAdmins) => {
    const status = quiz.status.data;
    const votes = quiz.votes.data;
    const players = quiz.players.data;

    if (status === null || votes === null || players === null || players.length === 0 || questionIndex === NO_QUESTION_INDEX) {
      return false;
    }

    let playersWhoHaveVotedCount = 0;
    for (const userType of USER_TYPES) {
      if (userType === UserType.Admin && ignoreAdmins) {
        continue;
      }

      const voters = Object.keys(votes[userType]);
      for (const voter of voters) {
        const hasVoted = votes[userType][voter][questionIndex] !== NO_VOTE_INDEX;
        if (!hasVoted) {
          continue;
        }

        const isPlaying = players.map((player) => player.username).includes(voter);
        if (!isPlaying) {
          continue;
        }

        playersWhoHaveVotedCount += 1;
      }
    }

    return playersWhoHaveVotedCount === players.length;
  }
);