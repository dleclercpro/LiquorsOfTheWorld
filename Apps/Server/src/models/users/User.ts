import bcrypt from 'bcrypt';
import { ADMINS, N_SALT_ROUNDS } from '../../config';
import logger from '../../logger';
import HashError from '../../errors/HashError';
import { Auth } from '../../types';
import { APP_DB } from '../..';
import { UserType } from '../../constants';

type UserArgs = Auth & { type: UserType };



class User {
    protected username: string;
    protected password: string;
    protected type: UserType;

    public constructor(args: UserArgs) {
        this.username = args.username;
        this.password = args.password;
        this.type = args.type;
    }

    public serialize() {
        const { username, password, type } = this;

        return JSON.stringify({
            username, password, type,
        });
    }

    public static deserialize(user: string) {
        return new User(JSON.parse(user));
    }

    public static async exists(username: string) {
        return APP_DB.has(`users:${username.toLowerCase()}`);
    }

    public getUsername() {
        return this.username;
    }

    public getPassword() {
        return this.password;
    }

    public getType() {
        return this.type;
    }

    public isAdmin() {
        return this.type === UserType.Admin;
    }

    public static isAdmin(username: string) {
        return ADMINS.map((admin) => admin.username.toLowerCase()).includes(username.toLowerCase());
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

    public async save() {
        await APP_DB.set(`users:${this.username}`, this.serialize());
    }

    public static async create(auth: Auth, type: UserType = UserType.Regular) {
        const username = auth.username.toLowerCase();
        const password = auth.password;

        logger.trace(`Creating ${type} user '${username}'...`);
        const user = new User({
            username,
            password: await User.hashPassword(password),
            type,
        });
      
        // Store user in DB
        await user.save();
      
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