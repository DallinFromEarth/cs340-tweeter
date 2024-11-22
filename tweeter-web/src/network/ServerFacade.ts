import {
    PagedItemRequest,
    PagedItemResponse,
    Status,
    StatusDTO,
    User,
    UserDTO,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
  export class ServerFacade {
    private SERVER_URL = "https://7yyg8n69ti.execute-api.us-west-1.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

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
        return this.getMoreUserItems(request, "/follower/list", "followers")
    }

    public async getMoreFollowees(
      request: PagedItemRequest<UserDTO>
    ): Promise<[User[], boolean]> {
      return this.getMoreUserItems(request, "/followee/list", "followees")
    }

    public async getMoreFeedItems(
      request: PagedItemRequest<StatusDTO>
    ): Promise<[Status[], boolean]> {
      return this.getMoreStatusItems(request, "/feed/items", "feed items")
    }

    public async getMoreStoryItems(
      request: PagedItemRequest<StatusDTO>
    ): Promise<[Status[], boolean]> {
      return this.getMoreStatusItems(request, "/story/items", "story items")
    }
  }