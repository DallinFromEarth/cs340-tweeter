import { AuthToken, User, Status, FakeData, PagedItemRequest, StatusDTO, PostStatusRequest } from "tweeter-shared";
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
          lastItem: lastItem ? lastItem.dto() : null
        }
        return ServerFacade.instance.getMoreFeedItems(request)
      };

      public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void>  {
        const request: PostStatusRequest = {
          token: authToken.token,
          userAlias: "",
          newStatus: newStatus.dto()
        }
        await ServerFacade.instance.postStatus(request)
      };
}