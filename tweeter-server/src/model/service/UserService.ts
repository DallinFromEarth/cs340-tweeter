import {User} from "tweeter-shared";
import {DynamoDaoFactory} from "../DataAccess/DynamoDao/DynamoDaoFactory";
import {AbstractDaoFactory} from "../DataAccess/AbstractDaoFactory";
import {AuthService} from "./AuthService";

export class UserService {
    private daoFactory: AbstractDaoFactory = new DynamoDaoFactory()

    public async getIsFollowerStatus (
        authToken: string,
        userAlias: string,
        selectedUser: User
      ): Promise<boolean> {
        await AuthService.validateAndGetUser(authToken)
        return await this.daoFactory.getFollowDao().isFollowing(userAlias, selectedUser.alias)
    };

    public async getFolloweesCount (
        authToken: string,
        userAlias: string
      ): Promise<number> {
        await AuthService.validateAndGetUser(authToken)
        return await this.daoFactory.getFollowDao().getFollowingCount(userAlias)
    };

    public async getFollowersCount (
        authToken: string,
        userAlias: string
      ): Promise<number> {
        await AuthService.validateAndGetUser(authToken)
        return await this.daoFactory.getFollowDao().getFollowerCount(userAlias)
    };

    public async follow (
        authToken: string,
        userAliasToFollow: string
    ): Promise<[followersCount: number, followeesCount: number]> {
        const user = await AuthService.validateAndGetUser(authToken)

        await this.daoFactory.getFollowDao().addFollower(user.alias, userAliasToFollow)
    
        let followersCount = await this.getFollowersCount(authToken, userAliasToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userAliasToFollow);
    
        return [followersCount, followeesCount];
    };

    public async unfollow (
        authToken: string,
        userAliasToUnfollow: string
    ): Promise<[followersCount: number, followeesCount: number]> {
        const user = await AuthService.validateAndGetUser(authToken)

        await this.daoFactory.getFollowDao().removeFollower(user.alias, userAliasToUnfollow)
    
        let followersCount = await this.getFollowersCount(authToken, userAliasToUnfollow);
        let followeesCount = await this.getFolloweesCount(authToken, userAliasToUnfollow);
    
        return [followersCount, followeesCount];
    };

    public async getUser (
        authToken: string,
        alias: string
      ): Promise<User | null> {
        await AuthService.validateAndGetUser(authToken)

        return await this.daoFactory.getUserDao().getUser(alias)
      };
}
