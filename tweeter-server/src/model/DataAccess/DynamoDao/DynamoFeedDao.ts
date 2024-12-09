import { DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import {FeedDao} from "../FeedDao";
import {Status, StatusDTO, User} from "tweeter-shared";

export class DynamoFeedDao implements FeedDao {
    private readonly client: DynamoDBDocumentClient;

    constructor(client: DynamoDBDocumentClient) {
        this.client = client;
    }

    readonly tableName = "feed";
    readonly followerAliasAttr = "follower_alias";
    readonly followeeAliasAttr = "followee_alias";
    readonly sortKeyAttr = "sort_key";
    readonly timestampAttr = "timestamp";
    readonly postAttr = "post";

    private createSortKey(timestamp: number, followeeAlias: string): string {
        // Create ISO string and remove any non-alphanumeric characters
        const isoTimestamp = new Date(timestamp).toISOString();
        return `${isoTimestamp}#${followeeAlias}`;
    }

    async addToFeed(followerAlias: string, followeeAlias: string, timestamp: number, post: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerAliasAttr]: followerAlias,
                [this.followeeAliasAttr]: followeeAlias,
                [this.sortKeyAttr]: this.createSortKey(timestamp, followeeAlias),
                [this.timestampAttr]: timestamp,
                [this.postAttr]: post
            }
        };

        await this.client.send(new PutCommand(params));
    }

    async getNextFeedPage(followerAlias: string, pageSize: number, lastStatus?: StatusDTO): Promise<[Status[], boolean]> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: "#follower = :follower",
            ExpressionAttributeNames: {
                "#follower": this.followerAliasAttr
            },
            ExpressionAttributeValues: {
                ":follower": followerAlias
            },
            Limit: pageSize,
            ScanIndexForward: false  // Get newest posts first
        };

        if (lastStatus) {
            params.ExclusiveStartKey = {
                [this.followerAliasAttr]: followerAlias,
                [this.sortKeyAttr]: this.createSortKey(lastStatus.timestamp, lastStatus.user.alias)
            };
        }

        const response = await this.client.send(new QueryCommand(params));

        const feedItems = await Promise.all((response.Items || []).map(async item => {
            return new Status(
                item[this.postAttr],
                new User("","", item[this.followeeAliasAttr], ""),
                item[this.timestampAttr]
            );
        }));
        const hasMore = !!response.LastEvaluatedKey;

        return [feedItems, hasMore];
    }
}
