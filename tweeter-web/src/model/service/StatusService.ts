import { AuthToken, User, Status, FakeData, PagedItemRequest, StatusDTO } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
    public async loadMoreStoryItems (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        const request: PagedItemRequest<StatusDTO> = {
          userAlias: user.alias,
          token: authToken.token,
          pageSize: pageSize,
          lastItem: lastItem ? lastItem.dto() : null
        }
        return ServerFacade.instance.getMoreStoryItems(request)
      };
    
      public async loadMoreFeedItems (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        const request: PagedItemRequest<StatusDTO> = {
          userAlias: user.alias,
          token: authToken.token,
          pageSize: pageSize,
          lastItem: lastItem
        }
        return ServerFacade.instance.getMoreFeedItems(request)
      };

      public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void>  {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
      };
}