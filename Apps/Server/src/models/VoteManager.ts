import { APP_DB } from '..';
import { UserType, NO_VOTE_INDEX, SEPARATOR } from '../constants';
import { GroupedVotesData, PlayerData } from '../types/DataTypes';
import Quiz from './Quiz';
import QuizManager from './QuizManager';
import User from './users/User';

class VoteManager {
  private static instance?: VoteManager;

    private constructor() {

    }

    public static getInstance() {
      if (!VoteManager.instance) {
        VoteManager.instance = new VoteManager();
      }
      return VoteManager.instance;
    }

    public async getAllVotes(quiz: Quiz): Promise<GroupedVotesData> {
        const votes: GroupedVotesData = { [UserType.Regular]: {}, [UserType.Admin]: {} };

        for (const player of quiz.getPlayers()) {
            const user = await User.get(player.username) as User;
            
            votes[user.getType()][user.getUsername()] = await this.getVotes(quiz, user);
        }
        
        return votes;
    }

    public async getVotes(quiz: Quiz, user: User): Promise<number[]> {
        const votesAsString = await APP_DB.get(`votes:${quiz.getId()}:${user.getUsername()}`);

        if (votesAsString !== null) {
            return this.deserializeUserVotes(votesAsString);
        } else {
            return await this.createInitialVotes(quiz);
        }
    }

    public async setVotes(quiz: Quiz, user: User, votes: number[]): Promise<void> {
        await APP_DB.set(`votes:${quiz.getId()}:${user.getUsername()}`, this.serializeUserVotes(votes));
    }

    public async createInitialVotes(quiz: Quiz): Promise<number[]> {
        const questionCount = await QuizManager.count(quiz.getName());
        return new Array(questionCount).fill(NO_VOTE_INDEX);
    }

    public async getPlayersWhoVoted(quiz: Quiz, questionIndex: number): Promise<PlayerData[]> {
        const votes = await this.getAllVotes(quiz);

        const players = quiz.getPlayers();

        let usernamesOfPlayersWhoVoted: string[] = [];

        for (const userType of Object.values(UserType)) {
            const allVotesForUserType = Object.entries(votes[userType]);

            usernamesOfPlayersWhoVoted = [
                ...usernamesOfPlayersWhoVoted, 
                ...allVotesForUserType
                    .filter(([_, playerVotes]) => playerVotes[questionIndex] !== NO_VOTE_INDEX)
                    .map(([player, _]) => player),
            ];
        }

        return usernamesOfPlayersWhoVoted.map((playerUsername) => players.find((player) => player.username === playerUsername)) as PlayerData[];
    }

    private serializeUserVotes(votes: number[]): string {
        return votes.join(SEPARATOR);
    }

    private deserializeUserVotes(votes: string): number[] {
        return votes.split(SEPARATOR).map(Number);
    }
}

export default VoteManager.getInstance();