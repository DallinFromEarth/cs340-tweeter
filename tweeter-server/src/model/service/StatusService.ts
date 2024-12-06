import { Status, FakeData, StatusDTO } from "tweeter-shared";
import {DynamoDaoFactory} from "../DataAccess/DynamoDao/DynamoDaoFactory";
import {AbstractDaoFactory} from "../DataAccess/AbstractDaoFactory";

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
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
      };
}
