import {DynamoFollowDao} from "./DynamoFollowDao";
import {DynamoAuthDao} from "./DynamoAuthDao";
import {AbstractDaoFactory} from "../AbstractDaoFactory";
import {FollowDao} from "../FollowDao";
import {AuthDao} from "../AuthDao";
import {UserDao} from "../UserDao";
import {DynamoUserDao} from "./DynamoUserDao";
import {StoryDao} from "../StoryDao";
import {DynamoStoryDao} from "./DynamoStoryDao";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {FeedDao} from "../FeedDao";
import {DynamoFeedDao} from "./DynamoFeedDao";

export class DynamoDaoFactory extends AbstractDaoFactory {
    private readonly client: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

    getFollowDao(): FollowDao {
        return new DynamoFollowDao(this.client);
    }

    getAuthDao(): AuthDao {
        return new DynamoAuthDao(this.client);
    }

    getUserDao(): UserDao {
        return new DynamoUserDao(this.client);
    }

    getStoryDao(): StoryDao {
        return new DynamoStoryDao(this.client);
    }

    getFeedDao(): FeedDao {
        return new DynamoFeedDao(this.client);
    }
}
