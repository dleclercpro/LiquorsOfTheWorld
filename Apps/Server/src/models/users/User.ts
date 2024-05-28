import bcrypt from 'bcrypt';
import { ADMINS, N_SALT_ROUNDS } from '../../config';
import logger from '../../logger';
import HashError from '../../errors/HashError';
import { Auth } from '../../types';
import { APP_DB } from '../..';

type UserArgs = Auth & { admin: boolean };



class User {
    protected username: string;
    protected password: string;
    protected admin: boolean;

    public constructor(args: UserArgs) {
        this.username = args.username;
        this.password = args.password;
        this.admin = args.admin;
    }

    public serialize() {
        const { username, password, isAdmin } = this;

        return JSON.stringify({
            username, password, isAdmin,
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

    public isAdmin() {
        return this.admin;
    }

    public static isAdmin(username: string) {
        return ADMINS.map((admin) => admin.username).includes(username);
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

    public static async create(auth: Auth, admin: boolean = false) {
        const { username, password } = auth;
        
        const lowercaseUsername = username.toLowerCase();
      
        logger.trace(`Creating user '${lowercaseUsername}'...`);
        const user = new User({
            username: lowercaseUsername,
            password: await User.hashPassword(password),
            admin,
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