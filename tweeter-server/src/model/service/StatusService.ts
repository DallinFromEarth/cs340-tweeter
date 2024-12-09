import { Status, FakeData, StatusDTO } from "tweeter-shared";
import {DynamoDaoFactory} from "../DataAccess/DynamoDao/DynamoDaoFactory";
import {AbstractDaoFactory} from "../DataAccess/AbstractDaoFactory";
import {AuthService} from "./AuthService";

export class StatusService {
  private daoFactory: AbstractDaoFactory = new DynamoDaoFactory()

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

          //publish to feeds yo
          let previous: String | undefined = undefined
          const feedDao = this.daoFactory.getFeedDao()
          while (true) {
              const daoResponse = await this.daoFactory.getFollowDao().getNextFollowersPage(user.alias, 3, previous)

              daoResponse[0].forEach((alias) => {
                  feedDao.addToFeed(alias.toString(), user.alias, newStatus.timestamp, newStatus.post)
              })

              if (!daoResponse[1]) break
          }
      };
}
