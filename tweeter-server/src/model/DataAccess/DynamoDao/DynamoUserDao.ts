import {UserDao} from "../UserDao";
import {User} from "tweeter-shared";
import {DynamoDBDocumentClient, GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export class DynamoUserDao implements UserDao {
    private readonly client: DynamoDBDocumentClient

    constructor(client: DynamoDBDocumentClient) {
        this.client = client
    }

    readonly tableName = "users";
    readonly userHandleAtrr = "user_handle";
    readonly firstNameAtrr = "first_name";
    readonly lastNameAtrr = "last_name";
    readonly imageLinkAtrr = "image_link";
    readonly hashedPasswordAtrr = "hashed_password";

    async getUser(alias: string): Promise<User | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.userHandleAtrr]: alias
            },
            ConsistentRead: true
        };

        const response = await this.client.send(new GetCommand(params));

        if (!response.Item) return null

        return new User(response.Item[this.firstNameAtrr],
                        response.Item[this.lastNameAtrr],
                        response.Item[this.userHandleAtrr],
                        response.Item[this.imageLinkAtrr])
    }

    async addUser(user: User, hashedPassword: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.userHandleAtrr]: user.alias,
                [this.firstNameAtrr]: user.firstName,
                [this.lastNameAtrr]: user.lastName,
                [this.imageLinkAtrr]: user.imageUrl,
                [this.hashedPasswordAtrr]: hashedPassword
            }
        };
        await this.client.send(new PutCommand(params));
    }

    async getHashedPassword(alias: string): Promise<string | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.userHandleAtrr]: alias
            },
            ConsistentRead: true
        };

        const response = await this.client.send(new GetCommand(params));

        if (!response.Item) return null

        return response.Item[this.hashedPasswordAtrr]
    }
}
