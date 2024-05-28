import bcrypt from 'bcrypt';
import { N_SALT_ROUNDS } from '../../config';
import logger from '../../logger';
import HashError from '../../errors/HashError';
import { Auth } from '../../types';
import { APP_DB } from '../..';

type UserArgs = Auth & { isAdmin: boolean };



class User {
    protected username: string;
    protected password: string;
    protected isAdmin: boolean;

    public constructor(args: UserArgs) {
        this.username = args.username;
        this.password = args.password;
        this.isAdmin = args.isAdmin;
    }

    protected serialize() {
        const { username, password, isAdmin } = this;

        return JSON.stringify({
            username, password, isAdmin,
        });
    }

    public getUsername() {
        return this.username;
    }

    public getPassword() {
        return this.password;
    }

    public static deserialize(user: string) {
        return new User(JSON.parse(user));
    }

    public static async exists(username: string) {
        return APP_DB.has(`users:${username.toLowerCase()}`);
    }

    public static async get(username: string) {
        const user = await APP_DB.get(`users:${username.toLowerCase()}`);

        if (!user) {
            return null;
        }

        return User.deserialize(user);
    }

    public static async getAll() {
        const usersAsString = await APP_DB.getKeysByPattern(`users:*`);

        return usersAsString.map((user) => User.deserialize(user));
    }

    public static async create(auth: Auth, isAdmin: boolean = false) {
        const { username, password } = auth;
        
        const lowercaseUsername = username.toLowerCase();
      
        logger.trace(`Creating user '${lowercaseUsername}'...`);
        const user = new User({
            username: lowercaseUsername,
            password: await User.hashPassword(password),
            isAdmin,
        });
      
        // Store user in DB
        await APP_DB.set(`users:${lowercaseUsername}`, user.serialize());
      
        return user;
    }

    public static async hashPassword(password: string) {
        return await new Promise<string>((resolve, reject) => {
            bcrypt.hash(password, N_SALT_ROUNDS, async (err, hash) => {
                if (err) {
                    logger.error(`Cannot hash password.`, err);
                    reject(new HashError());
                }
      
                resolve(hash);
            });
        });
    }
}

export default User;