import {UserDao} from "./UserDao";
import {FollowDao} from "./FollowDao";
import {AuthDao} from "./AuthDao";
import {StoryDao} from "./StoryDao";
import {FeedDao} from "./FeedDao";
import {ImageDao} from "./ImageDao";

export abstract class AbstractDaoFactory {
    abstract getFollowDao(): FollowDao;
    abstract getAuthDao(): AuthDao;
    abstract getUserDao(): UserDao;
    abstract getStoryDao(): StoryDao;
    abstract getFeedDao(): FeedDao;
    abstract getImageDao(): ImageDao;
}
