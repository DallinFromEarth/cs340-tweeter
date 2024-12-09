import {
  AuthRequest,
  AuthResponse,
    ChangeFollowRequest,
    CountResponse,
    IsFollowerRequest,
    IsFollowerResponse,
    PagedItemRequest,
    PagedItemResponse,
    PostStatusRequest,
    RegisterRequest,
    Status,
    StatusDTO,
    TweeterRequest,
    TweeterResponse,
    User,
    UserDTO,
    UserResponse,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://7yyg8n69ti.execute-api.us-west-1.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    private currentSessionToken: string | null = null;

    private static _instance: ServerFacade | null = null;
    public static get instance(): ServerFacade {
        if (this._instance === null) {
            this._instance = new ServerFacade();
        }
        return this._instance
    } 
  
    private async getMoreUserItems(
        request: PagedItemRequest<UserDTO>,
        endpoint: string,
        itemDescription: string
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
        PagedItemRequest<UserDTO>,
        PagedItemResponse<UserDTO>
      >(request, endpoint);
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDTO(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No ${itemDescription} found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message?.toString());
      }
    }

    private async getMoreStatusItems(
      request: PagedItemRequest<StatusDTO>,
      endpoint: string,
      itemDescription: string
  ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDTO>,
      PagedItemResponse<StatusDTO>
    >(request, endpoint);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDTO(dto) as Status)
        : null;

    // Handle errors    
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${itemDescription} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message?.toString());
    }
  }

    public async getMoreFollowers(
        request: PagedItemRequest<UserDTO>
    ): Promise<[User[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return await this.getMoreUserItems(request, "/follower/list", "followers")
    }

    public async getMoreFollowees(
      request: PagedItemRequest<UserDTO>
    ): Promise<[User[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return await this.getMoreUserItems(request, "/followee/list", "followees")
    }

    public async getMoreFeedItems(
      request: PagedItemRequest<StatusDTO>
    ): Promise<[Status[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return await this.getMoreStatusItems(request, "/feed/items", "feed items")
    }

    public async getMoreStoryItems(
      request: PagedItemRequest<StatusDTO>
    ): Promise<[Status[], boolean]> {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      return await this.getMoreStatusItems(request, "/story/items", "story items")
    }

    public async doRegister(
      request: RegisterRequest
    ): Promise<AuthResponse> {
      const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthResponse
    >(request, "/auth/register");

      this.handleRequestError(response, 'register')

      // @ts-ignore
      this.currentSessionToken = response.authToken._token
      return response
    }

    public async doLogin(
      request: AuthRequest
    ): Promise<AuthResponse> {
      const response = await this.clientCommunicator.doPost<
      AuthRequest,
      AuthResponse
    >(request, "/auth/login")

      this.handleRequestError(response, 'login')

      // @ts-ignore
      this.currentSessionToken = response.authToken._token
      console.log("SAVING TOKEN:", this.currentSessionToken)
      return response
    }

    public async doLogout(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      TweeterResponse
      >(request, "/auth/logout")

      this.handleRequestError(response, 'logout')

      this.currentSessionToken = null
      return response
    }

    public async postStatus(request: PostStatusRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
      >(request, "/status")

      this.handleRequestError(response, 'post status')

      return response
    }

    public async getFolloweesCount(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      CountResponse
      >(request, "/followee/count")

      this.handleRequestError(response, 'get followees count')

      return response
    }

    public async getFollowersCount(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      CountResponse
      >(request, "/follower/count")

      this.handleRequestError(response, 'get followers count')

      return response
    }

    public async getIsFollowerStatus(request: IsFollowerRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
      >(request, "/follower/check")

      this.handleRequestError(response, 'check is follower status')

      return response
    }

    public async doFollow(request: ChangeFollowRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      ChangeFollowRequest,
      TweeterResponse
      >(request, "/follow")

      this.handleRequestError(response, 'follow user')

      return response
    }

    public async doUnfollow(request: ChangeFollowRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      ChangeFollowRequest,
      TweeterResponse
      >(request, "/unfollow")

      this.handleRequestError(response, 'unfollow user')

      return response
    }

    public async getUser(request: TweeterRequest) {
      if (this.currentSessionToken != null) request.token = this.currentSessionToken

      const response = await this.clientCommunicator.doPost<
      TweeterRequest,
      UserResponse
      >(request, "/user")

      this.handleRequestError(response, 'get user')

      return response
    }

    private handleRequestError(response: any, context: string) {
      if (!response.success) {
        console.error(response);
        throw new Error(response.errorMessage || `Failed to ${context}`);
      }
    }
  }
