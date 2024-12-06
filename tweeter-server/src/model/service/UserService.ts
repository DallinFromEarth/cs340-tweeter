import { FakeData, User } from "tweeter-shared";
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
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    };

    public async getFolloweesCount (
        authToken: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(userAlias);
    };

    public async getFollowersCount (
        authToken: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(userAlias);
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
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.getFollowersCount(authToken, userAliasToUnfollow);
        let followeesCount = await this.getFolloweesCount(authToken, userAliasToUnfollow);
    
        return [followersCount, followeesCount];
    };

    public async getUser (
        authToken: string,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };
}
