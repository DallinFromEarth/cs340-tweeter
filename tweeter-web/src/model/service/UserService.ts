import { AuthRequest, AuthToken, ChangeFollowRequest, IsFollowerRequest, RegisterRequest, TweeterRequest, User } from "tweeter-shared";
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
        const request: ChangeFollowRequest = {
          token: authToken.token,
          userAlias: "",
          userToFollowOrNot: userToFollow.dto()
        }
        ServerFacade.instance.doFollow(request)
    
        let followersCount = await this.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToFollow);
    
        return [followersCount, followeesCount];
    };

    public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followersCount: number, followeesCount: number]> {
        const request: ChangeFollowRequest = {
          token: authToken.token,
          userAlias: "",
          userToFollowOrNot: userToUnfollow.dto()
        }
        ServerFacade.instance.doUnfollow(request)
    
        let followersCount = await this.getFollowersCount(authToken, userToUnfollow);
        let followeesCount = await this.getFolloweesCount(authToken, userToUnfollow);
    
        return [followersCount, followeesCount];
    };

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        const request: TweeterRequest = {
          token: authToken.token,
          userAlias: alias
        }
        
        const response = await ServerFacade.instance.getUser(request)
        return User.fromDTO(response.user)
      };

    public async logout (authToken: AuthToken): Promise<void> {
      const request: TweeterRequest = {
        token: authToken.token,
        userAlias: ""
      }
      await ServerFacade.instance.doLogout(request)
    };
}