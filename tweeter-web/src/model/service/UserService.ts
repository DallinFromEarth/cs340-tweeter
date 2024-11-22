import { AuthRequest, AuthToken, FakeData, IsFollowerRequest, IsFollowerResponse, RegisterRequest, TweeterRequest, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
    public async login (alias: string, password: string): Promise<[User, AuthToken]> {
        const request: AuthRequest = {
          userAlias: alias,
          password: password,
          token: ""
        }

        const response = await ServerFacade.instance.doLogin(request)
    
        return [User.fromDTO(response.user), response.authToken];
    };

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
      ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        let imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");

        const request: RegisterRequest = {
          firstName: firstName,
          lastName: lastName,
          userAlias: alias,
          password: password,
          userImage: imageStringBase64,
          token: ""
        }
    
        const response = await ServerFacade.instance.doRegister(request)
    
        return [User.fromDTO(response.user), response.authToken];
    };

    public async getIsFollowerStatus (
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        const request: IsFollowerRequest = {
          token: authToken.token,
          userAlias: user.alias,
          selectedUser: selectedUser.dto()
        }
        
        const response = await ServerFacade.instance.getIsFollowerStatus(request)
        return response.isFollower
    };

    public async getFolloweesCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        const request: TweeterRequest = {
          token: authToken.token,
          userAlias: user.alias
        }
        const response = await ServerFacade.instance.getFolloweesCount(request)
        return response.count
    };

    public async getFollowersCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        const request: TweeterRequest = {
          token: authToken.token,
          userAlias: user.alias
        }
        const response = await ServerFacade.instance.getFollowersCount(request)
        return response.count
    };

    public async follow (
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the following message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToFollow);
    
        return [followersCount, followeesCount];
    };

    public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);
    
        return [followersCount, followeesCount];
    };

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };

    public async logout (authToken: AuthToken): Promise<void> {
      const request: TweeterRequest = {
        token: authToken.token,
        userAlias: ""
      }
      await ServerFacade.instance.doLogout(request)
    };
}