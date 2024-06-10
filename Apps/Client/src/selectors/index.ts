import { createSelector } from 'reselect';
import { NO_QUESTION_INDEX, NO_VOTE_INDEX, USER_TYPES, UserType } from '../constants';
import { RootState } from '../stores/store';
import { AnswerData, GroupedVoteCountData } from '../types/DataTypes';

const getQuiz = (state: RootState) => state.quiz;
const getUser = (state: RootState) => state.user;
const getQuestionIndex = (_state: RootState, questionIndex: number) => questionIndex;

const getQuestions = createSelector(
  [getQuiz],
  (quiz) => quiz.questions.data
);

const getVotes = createSelector(
  [getQuiz],
  (quiz) => quiz.votes.data
);

const getPlayers = createSelector(
  [getQuiz],
  (quiz) => quiz.players.data
);

const getStatus = createSelector(
  [getQuiz],
  (quiz) => quiz.status.data
);



export const selectQuestion = createSelector(
  [getQuestions, getQuestionIndex],
  (questions, questionIndex) => {
    if (questions === null || questionIndex === NO_QUESTION_INDEX) {
      return null;
    }

    const isQuestionIndexValid = 0 <= questionIndex && questionIndex < questions.length;
    if (!isQuestionIndexValid) {
      throw new Error('INVALID_QUESTION_INDEX');
    }

    return questions[questionIndex];
  }
);

export const selectChosenAnswer = createSelector(
  [getUser, getVotes, selectQuestion, getQuestionIndex],
  (user, votes, question, questionIndex): AnswerData | null => {
    if (user.username === null || votes === null || question === null) {
      return null;
    }

    const currentVotes = votes[user.isAdmin ? UserType.Admin : UserType.Regular][user.username];
    if (!currentVotes) {
      return null;
    }

    const voteIndex = currentVotes[questionIndex];
    if (voteIndex === NO_VOTE_INDEX) {
      return null;
    }

    return {
      index: voteIndex,
      value: question.options[voteIndex],
    };
  }
);

export const selectCorrectAnswer = createSelector(
  [getStatus, selectQuestion],
  (status, question): AnswerData | null => {
    if (status === null || question === null) {
      return null;
    }

    return {
      index: question.answer,
      value: question.options[question.answer],
    };
  }
);

export const selectVoteCounts = createSelector(
  [getVotes, getPlayers, getQuestionIndex],
  (votes, players, questionIndex) => {
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
  [getStatus, getVotes, getPlayers, getQuestionIndex, (_state: RootState, _questionIndex: number, ignoreAdmins: boolean) => ignoreAdmins],
  (status, votes, players, questionIndex, ignoreAdmins) => {
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