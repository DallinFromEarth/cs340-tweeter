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
        // TODO: Replace with the result of calling server
        const [statuses, moreItems] = FakeData.instance.getPageOfStatuses(Status.fromDTO(lastItem), pageSize)
        const statusDtos = statuses.map((status: Status) => {
          return status.dto()
        })
        return [statusDtos, moreItems]
      };
    
      public async loadMoreFeedItems (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDTO | null
      ): Promise<[StatusDTO[], boolean]> {
        // TODO: Replace with the result of calling server
        const [statuses, moreItems] = FakeData.instance.getPageOfStatuses(Status.fromDTO(lastItem), pageSize)
        const statusDtos = statuses.map((status: Status) => {
          return status.dto()
        })
        return [statusDtos, moreItems]
      };

      public async postStatus (
        authToken: string,
        newStatus: Status
      ): Promise<void>  {
          const user = await AuthService.validateAndGetUser(authToken)

          await this.daoFactory.getStoryDao().addStory(user.alias, newStatus.post)
      };
}
