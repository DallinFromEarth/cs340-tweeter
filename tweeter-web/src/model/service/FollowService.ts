import { AuthToken, User, PagedItemRequest, UserDTO } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
    public async loadMoreFollowers (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedItemRequest<UserDTO> = {
          userAlias: user.alias,
          token: authToken.token,
          pageSize: pageSize,
          lastItem: lastItem ? lastItem.dto() : null
        }
        return ServerFacade.instance.getMoreFollowers(request)
      };
    
      public async loadMoreFollowees (
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedItemRequest<UserDTO> = {
          userAlias: user.alias,
          token: authToken.token,
          pageSize: pageSize,
          lastItem: lastItem ? lastItem.dto() : null
        }
        return ServerFacade.instance.getMoreFollowees(request)
      };
}