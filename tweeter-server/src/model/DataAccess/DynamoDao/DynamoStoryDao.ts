import {StoryDao} from "../StoryDao";
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";

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
}
