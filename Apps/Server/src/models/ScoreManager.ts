import { UserType, NO_VOTE_INDEX } from '../constants';
import { GroupedScoresData, ScoreData } from '../types/DataTypes';
import { getRange } from '../utils/array';
import Quiz from './Quiz';
import QuizManager from './QuizManager';
import VoteManager from './VoteManager';
import User from './users/User';

class ScoreManager {
    private static instance?: ScoreManager;

    private constructor() {

    }

    public static getInstance() {
      if (!ScoreManager.instance) {
        ScoreManager.instance = new ScoreManager();
      }
      return ScoreManager.instance;
    }

    public async getAllScores(quiz: Quiz): Promise<GroupedScoresData> {
        const scores: GroupedScoresData = { [UserType.Regular]: {}, [UserType.Admin]: {} };

        for (const player of quiz.getPlayers()) {
            const user = await User.get(player.username) as User;
            scores[user.getType()][player.username] = await this.getUserScores(quiz, user);
        }

        return scores;
    }

    public async getUserScores(quiz: Quiz, user: User): Promise<ScoreData> {
        const currentQuestionIndex = quiz.getQuestionIndex();

        const votes = await VoteManager.getAllVotes(quiz);
        const questions = await QuizManager.get(quiz.getName());
        const answers = questions.map((question) => question.answer);

        const userVotes = votes[user.getType()][user.getUsername()];

        // Only return right/wrong/missed counts up to the last question that was made
        // visible to the users
        const lastClosedQuestionIndex = quiz.isOver() ? questions.length - 1 : (quiz.isTimed() && quiz.isTimerDone(currentQuestionIndex) ? currentQuestionIndex : currentQuestionIndex - 1);

        const right = answers.filter((answerIndex, i) => i <= lastClosedQuestionIndex && answerIndex === userVotes[i] && userVotes[i] !== NO_VOTE_INDEX).length;
        const wrong = answers.filter((answerIndex, i) => i <= lastClosedQuestionIndex && answerIndex !== userVotes[i] && userVotes[i] !== NO_VOTE_INDEX).length;
        const missed = userVotes.filter((voteIndex, i) => i <= lastClosedQuestionIndex && voteIndex === NO_VOTE_INDEX).length;
        const unanswered = userVotes.filter((voteIndex) => voteIndex === NO_VOTE_INDEX).length - missed;

        return {
            right,
            wrong,
            missed,
            unanswered,
        };
    }
}

export default ScoreManager.getInstance();
