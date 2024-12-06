import {User} from "tweeter-shared";

export interface UserDao {
    /**
     * returns null if no user found
     */
    getUser(alias: string): Promise<User | null>
    getHashedPassword(alias: string): Promise<string | null>
    addUser(user: User, hashedPassword: string): Promise<void>
}
