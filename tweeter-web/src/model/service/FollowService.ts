import { AuthToken, User, PagedUserItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
    public async loadMoreFollowers (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedUserItemRequest = {
          userAlias: user.alias,
          token: authToken.token,
          pageSize: pageSize,
          lastItem: lastItem
        }
        return ServerFacade.instance.getMoreFollowers(request)
      };
    
      public async loadMoreFollowees (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedUserItemRequest = {
          userAlias: user.alias,
          token: authToken.token,
          pageSize: pageSize,
          lastItem: lastItem
        }
        return ServerFacade.instance.getMoreFollowees(request)
      };
}