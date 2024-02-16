import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { PAGE_SIZE, UserItemPresenter, UserItemView } from "./UserItemPresenter";

export class FollowersPresenter extends UserItemPresenter{
    private service: FollowService;

    private lastItem: User | null = null;

    public constructor(view: UserItemView) {
        super(view)
        this.service = new FollowService();
    }

    public async loadMoreItems(authToken: AuthToken, user: User) {
        try {
          if (this.hasMoreItems) {
            let [newItems, hasMore] = await this.service.loadMoreFollowers(authToken, user, PAGE_SIZE, this.lastItem);
    
            this.hasMoreItems = hasMore;
            this.lastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load follower because of exception: ${error}`
          );
        }
    };
}