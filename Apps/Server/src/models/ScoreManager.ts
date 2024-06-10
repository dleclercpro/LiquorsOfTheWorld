import { UserType, NO_VOTE_INDEX } from '../constants';
import { GroupedScoresData } from '../types/DataTypes';
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

    public async getUserScores(quiz: Quiz, user: User) {
        const votes = await VoteManager.getAllVotes(quiz);
        const questions = await QuizManager.get(quiz.getName());
        const answers = questions.map((question) => question.answer);

        const userVotes = votes[user.getType()][user.getUsername()];

        return {
            total: userVotes.filter((vote) => vote !== NO_VOTE_INDEX).length,
            value: answers.filter((answerIndex, i) => answerIndex === userVotes[i]).length
        };
    }
}

export default ScoreManager.getInstance();
