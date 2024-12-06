import { User, FakeData, UserDTO } from "tweeter-shared";
import {DynamoDaoFactory} from "../DataAccess/DynamoDao/DynamoDaoFactory";
import {AbstractDaoFactory} from "../DataAccess/AbstractDaoFactory";

export class FollowService {
  private daoFactory: AbstractDaoFactory = new DynamoDaoFactory()

  public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDTO | null
      ): Promise<[UserDTO[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };
    
      public async loadMoreFollowees (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDTO | null
      ): Promise<[UserDTO[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      }

      private async getFakeData(lastItem: UserDTO | null, pageSize: number, userAlias: string): Promise<[UserDTO[], boolean]>  {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDTO(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto());
        return [dtos, hasMore];
      }
}
