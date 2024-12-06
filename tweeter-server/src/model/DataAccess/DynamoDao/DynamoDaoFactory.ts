import {DynamoFollowDao} from "./DynamoFollowDao";
import {DynamoAuthDao} from "./DynamoAuthDao";
import {AbstractDaoFactory} from "../AbstractDaoFactory";
import {FollowDao} from "../FollowDao";
import {AuthDao} from "../AuthDao";
import {UserDao} from "../UserDao";
import {DynamoUserDao} from "./DynamoUserDao";

export class DynamoDaoFactory extends AbstractDaoFactory {
    getFollowDao(): FollowDao {
        return new DynamoFollowDao();
    }

    getAuthDao(): AuthDao {
        return new DynamoAuthDao();
    }

    getUserDao(): UserDao {
        return new DynamoUserDao();
    }
}
