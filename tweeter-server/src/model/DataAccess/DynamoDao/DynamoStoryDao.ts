import {StoryDao} from "../StoryDao";
import {DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput} from "@aws-sdk/lib-dynamodb";
import {Status, User} from "tweeter-shared";

export class DynamoStoryDao implements StoryDao {
    private readonly client: DynamoDBDocumentClient

    constructor(client: DynamoDBDocumentClient) {
        this.client = client
    }

    readonly tableName = "stories";
    readonly aliasAtrr = "author_alias";
    readonly timeAtrr = "timestamp";
    readonly postAtrr = "post"

    async addStory(alias: string, post: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.aliasAtrr]: alias,
                [this.timeAtrr]: Date.now(),
                [this.postAtrr]: post,
            }
        };

        await this.client.send(new PutCommand(params));
    }

    async getStoriesForUser(alias: string): Promise<any[]> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: "#alias = :alias",
            ExpressionAttributeNames: {
                "#alias": this.aliasAtrr
            },
            ExpressionAttributeValues: {
                ":alias": alias
            }
        };

        const response = await this.client.send(new QueryCommand(params));
        return response.Items || [];
    }

    async getNextStoriesPage(alias: string, pageSize: number, lastTimestamp?: number): Promise<[Status[], boolean]> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: "#alias = :alias",
            ExpressionAttributeNames: {
                "#alias": this.aliasAtrr
            },
            ExpressionAttributeValues: {
                ":alias": alias
            },
            Limit: pageSize,
            ScanIndexForward: false
        };

        if (lastTimestamp) {
            params.ExclusiveStartKey = {
                [this.aliasAtrr]: alias,
                [this.timeAtrr]: lastTimestamp
            };
        }

        const response = await this.client.send(new QueryCommand(params));

        const stories = await Promise.all((response.Items || []).map(async item => {
            return new Status(
                item[this.postAtrr],
                new User("","", alias, ""),
                item[this.timeAtrr]
            );
        }));

        const hasMore = !!response.LastEvaluatedKey;

        return [stories, hasMore];
    }
}
