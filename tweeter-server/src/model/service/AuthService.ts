import {DynamoDaoFactory} from "../DataAccess/DynamoDao/DynamoDaoFactory";
import {AuthToken, User} from "tweeter-shared";
import {AbstractDaoFactory} from "../DataAccess/AbstractDaoFactory";
import {UserDao} from "../DataAccess/UserDao";
import * as bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
    private static daoFactory: AbstractDaoFactory = new DynamoDaoFactory()

    public async login (alias: string, password: string): Promise<[User, AuthToken]> {
        const realAlias = '@' + alias

        const userDao: UserDao = AuthService.daoFactory.getUserDao()

        const hashedPassword = await userDao.getHashedPassword(realAlias)

        if (!hashedPassword) throw new Error("User not found")

        if (!await bcrypt.compare(password, hashedPassword)) throw new Error("Wrong password... into the river you go!")

        const user = await userDao.getUser(realAlias)
        if (user == null) throw new Error("something went wrong fetching user object")
        const auth = await this.generateNewSession(realAlias)

        return [user, auth];
    };

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string
    ): Promise<[User, AuthToken]> {
        const userDao: UserDao = AuthService.daoFactory.getUserDao()
        const realAlias = '@' + alias
        const test: User | null = await userDao.getUser(realAlias)
        if (test != null) { throw new Error("Username already taken!") }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profilePicLink = await AuthService.daoFactory.getImageDao().putImage(alias, userImageBytes)

        await userDao.addUser(new User(firstName, lastName, realAlias, profilePicLink), hashedPassword)

        const authToken: AuthToken = await this.generateNewSession(realAlias)

        const newUser: User | null = await userDao.getUser(realAlias)
        if (newUser == null) { throw new Error("Somehow the user didn't get added to the database") }

        return [newUser, authToken];
    };

    public async logout (authToken: string): Promise<void> {
        await AuthService.daoFactory.getAuthDao().deleteToken(authToken)
    };

    /**
     * ensures the provided authToken is valid, and if it is valid, returns the associated User object.
     * It also refreshes the authToken if valid.
     * If it's not valid, it throws an error.
     * @param authToken
     */
    public static async validateAndGetUser(authToken: string): Promise<User> {
        const username: string | null = await this.daoFactory.getAuthDao().getUserByToken(authToken)

        if (username == null) throw new Error("AuthToken is invalid. Throw source: validateAndGetUser()")

        const user = await this.daoFactory.getUserDao().getUser(username)

        if (user == null) throw new Error("User doesn't exist! Throw source: validateAndGetUser()")

        await this.daoFactory.getAuthDao().refreshToken(authToken)

        return user
    }

    private async generateNewSession(alias: string): Promise<AuthToken> {
        const token = uuidv4();
        await AuthService.daoFactory.getAuthDao().addAuth(token, alias)

        return new AuthToken(token, Date.now())
    }
}
