import {UserDao} from "./UserDao";
import {FollowDao} from "./FollowDao";
import {AuthDao} from "./AuthDao";

export abstract class AbstractDaoFactory {
    abstract getFollowDao(): FollowDao;
    abstract getAuthDao(): AuthDao;
    abstract getUserDao(): UserDao;
}
