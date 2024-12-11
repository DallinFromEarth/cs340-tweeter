import { Status, StatusDTO } from "tweeter-shared";
import {DynamoDaoFactory} from "../DataAccess/DynamoDao/DynamoDaoFactory";
import {AbstractDaoFactory} from "../DataAccess/AbstractDaoFactory";
import {AuthService} from "./AuthService";
import {PostStatusMessage} from "../messages/StatusMessages";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class StatusService {
    private daoFactory: AbstractDaoFactory = new DynamoDaoFactory()

    private readonly sqsClient = new SQSClient({ region: "us-west-1" });
    private readonly POST_STATUS_QUEUE_URL = "https://sqs.us-west-1.amazonaws.com/378503310330/tweeter-post-status";


    public async loadMoreStoryItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDTO | null
      ): Promise<[StatusDTO[], boolean]> {
        await AuthService.validateAndGetUser(authToken)
        const [statuses, moreItems] = await this.daoFactory.getStoryDao().getNextStoriesPage(userAlias, pageSize, lastItem? lastItem.timestamp: undefined)
        const statusDtos: StatusDTO[] = await Promise.all(statuses.map(async (status: Status): Promise<StatusDTO> => {
          return await this.replaceUserOnStatusDTO(status.dto())
        }));

        return [statusDtos, moreItems]
      };

  private async replaceUserOnStatusDTO(status: StatusDTO): Promise<StatusDTO> {
      const user = await this.daoFactory.getUserDao().getUser(status.user.alias)
      if (user == null) throw new Error("Idk, I'm tired of dealing with this. replaceUserOnStatusDTO()")

      return {
          post: status.post,
          timestamp: status.timestamp,
          user: user.dto()
      }
  }
    
      public async loadMoreFeedItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDTO | null
      ): Promise<[StatusDTO[], boolean]> {
        await AuthService.validateAndGetUser(authToken)

        const [statuses, moreItems] = await this.daoFactory.getFeedDao().getNextFeedPage(userAlias, pageSize, lastItem ? lastItem : undefined)
        const statusDtos: StatusDTO[] = await Promise.all(statuses.map(async (status: Status): Promise<StatusDTO> => {
          return await this.replaceUserOnStatusDTO(status.dto())
        }));
        return [statusDtos, moreItems]
      };

      public async postStatus (
        authToken: string,
        newStatus: Status
      ): Promise<void>  {
          const user = await AuthService.validateAndGetUser(authToken)

          await this.daoFactory.getStoryDao().addStory(user.alias, newStatus.post)

          try {
              const message: PostStatusMessage = {
                  authorAlias: newStatus.user.alias,
                  post: newStatus.post,
                  timestamp: newStatus.timestamp
              };

              const command = new SendMessageCommand({
                  QueueUrl: this.POST_STATUS_QUEUE_URL,
                  MessageBody: JSON.stringify(message)
              });

              await this.sqsClient.send(command);

              return
          } catch (error) {
              console.error("Error sending message to SQS:", error);
              throw error;
          }
      };
}
