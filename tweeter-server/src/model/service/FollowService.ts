import { UserDTO } from "tweeter-shared";
import {DynamoDaoFactory} from "../DataAccess/DynamoDao/DynamoDaoFactory";
import {AbstractDaoFactory} from "../DataAccess/AbstractDaoFactory";
import {AuthService} from "./AuthService";
import {UserDao} from "../DataAccess/UserDao";

export class FollowService {
  private daoFactory: AbstractDaoFactory = new DynamoDaoFactory()

    public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDTO | null
      ): Promise<[UserDTO[], boolean]> {
      await AuthService.validateAndGetUser(token)

      const result = await this.daoFactory.getFollowDao().getNextFollowersPage(userAlias, pageSize, lastItem ? lastItem.alias : undefined)

      const results = await this.processAliasesIntoDTOs(result[0])

      return [results, result[1]]
    };
    
      public async loadMoreFollowees (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDTO | null
      ): Promise<[UserDTO[], boolean]> {
        await AuthService.validateAndGetUser(token)

        const result = await this.daoFactory.getFollowDao().getNextFolloweesPage(userAlias, pageSize, lastItem ? lastItem.alias : undefined)

        const results = await this.processAliasesIntoDTOs(result[0])

        return [results, result[1]]
      }

      private async processAliasesIntoDTOs(aliases: String[]): Promise<UserDTO[]> {
        const userDao: UserDao = this.daoFactory.getUserDao()

        const results: UserDTO[] = await Promise.all(aliases.map(async (alias) => {
          const user = await userDao.getUser(alias.toString())
          if (user == null) throw new Error("Somehow someone is following a user that doesn't exist")
          return user.dto()
        }));

        return results
      }
}
