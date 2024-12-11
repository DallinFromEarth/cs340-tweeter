import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {AuthDao} from "../AuthDao";

export class DynamoAuthDao implements AuthDao {
    private readonly client: DynamoDBDocumentClient

    constructor(client: DynamoDBDocumentClient) {
        this.client = client
    }

    readonly tableName = "auth";
    readonly tokenAtrr = "token";
    readonly userHandleAtrr = "user_handle";
    readonly expiresAtrr = "expires_at"

    private readonly MINUTES_TO_LIVE = 5

    async addAuth(token: string, user_handle: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.tokenAtrr]: token,
                [this.userHandleAtrr]: user_handle,
                [this.expiresAtrr]: (Date.now() + (60 * 1000 * this.MINUTES_TO_LIVE))
            },
            ConsistentRead: true
        };
        await this.client.send(new PutCommand(params));
    }

    async getUserByToken(token: string): Promise<string | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.tokenAtrr]: token
            },
            ConsistentRead: true
        };

        console.log('Table Name:', this.tableName);
        console.log('Token Attr:', this.tokenAtrr);
        console.log('Params:', JSON.stringify(params));

        const response = await this.client.send(new GetCommand(params));

        if (!response.Item) return null

        if (response.Item[this.expiresAtrr] < Date.now()) {
            await this.deleteToken(token)
            return null
        }
        return response.Item[this.userHandleAtrr];
    }

    async refreshToken(token: string): Promise<void> {
        const newExpirationTime = Date.now() + (60 * 1000 * this.MINUTES_TO_LIVE);

        const params = {
            TableName: this.tableName,
            Key: {
                [this.tokenAtrr]: token
            },
            UpdateExpression: "SET expires = :newTime",
            ExpressionAttributeValues: {
                ":newTime": newExpirationTime
            }
        };

        await this.client.send(new UpdateCommand(params));
    }

    async deleteToken(token: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.tokenAtrr]: token
            }
        };

        await this.client.send(new DeleteCommand(params));
    }
}
