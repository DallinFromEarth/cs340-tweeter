import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {FollowDao} from "../FollowDao";

export class DynamoFollowDao implements FollowDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    readonly tableName = "follows";
    readonly indexName = "follows-index";
    readonly followeeHandleAtrr = "followee_handle";
    readonly followerHandleAtrr = "follower_handle";

    /**
     * Follower will now be following followee
     * @param follower_handle the user making the request
     * @param followee_handle the user that will now be followed
     */
    async addFollower(follower_handle: String, followee_handle: String) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followeeHandleAtrr]: followee_handle,
                [this.followerHandleAtrr]: follower_handle
            }
        };
        await this.client.send(new PutCommand(params));
    }

}
