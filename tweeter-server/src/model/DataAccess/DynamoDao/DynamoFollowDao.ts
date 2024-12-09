import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    QueryCommandInput
} from "@aws-sdk/lib-dynamodb";
import {FollowDao} from "../FollowDao";

export class DynamoFollowDao implements FollowDao {
    private readonly client: DynamoDBDocumentClient

    constructor(client: DynamoDBDocumentClient) {
        this.client = client
    }

    readonly tableName = "follows";
    readonly indexName = "follows_index";
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

    async removeFollower(follower_handle: String, followee_handle: String): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followeeHandleAtrr]: followee_handle,
                [this.followerHandleAtrr]: follower_handle
            }
        };

        await this.client.send(new DeleteCommand(params));
    }


    async getFollowerCount(followee_handle: String): Promise<number> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            IndexName: this.indexName,  // Use the GSI that has followee_handle as the key
            KeyConditionExpression: "#followee = :followee",
            ExpressionAttributeNames: {
                "#followee": this.followeeHandleAtrr
            },
            ExpressionAttributeValues: {
                ":followee": followee_handle
            },
            Select: "COUNT"
        };

        const response = await this.client.send(new QueryCommand(params));
        return response.Count || 0;
    }

    async getFollowingCount(follower_handle: String): Promise<number> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: "#followee = :followee AND #follower = :follower",
            ExpressionAttributeNames: {
                "#followee": this.followeeHandleAtrr,
                "#follower": this.followerHandleAtrr
            },
            ExpressionAttributeValues: {
                ":followee": follower_handle,  // The index requires followee_handle
                ":follower": follower_handle   // The follower we're counting for
            },
            Select: "COUNT"
        };

        const response = await this.client.send(new QueryCommand(params));
        return response.Count || 0;
    }

    async isFollowing(follower_handle: String, followee_handle: String): Promise<boolean> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: "#followee = :followee AND #follower = :follower",
            ExpressionAttributeNames: {
                "#followee": this.followeeHandleAtrr,
                "#follower": this.followerHandleAtrr
            },
            ExpressionAttributeValues: {
                ":followee": followee_handle,
                ":follower": follower_handle
            }
        };

        const response = await this.client.send(new QueryCommand(params));
        return (response.Items || []).length > 0;
    }
}
