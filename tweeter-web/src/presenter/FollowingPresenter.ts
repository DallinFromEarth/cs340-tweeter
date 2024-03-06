import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { PAGE_SIZE, UserItemPresenter, UserItemView } from "./UserItemPresenter";

export class FollowingPresenter extends UserItemPresenter {
    private service: FollowService;

    private lastItem: User | null = null;

    public constructor(view: UserItemView) {
        super(view)
        this.service = new FollowService();
    }

    protected get view(): UserItemView {
      return super.view as UserItemView;
    }
 
    public async loadMoreItems(authToken: AuthToken, user: User) {
        try {
          if (this.hasMoreItems) {
            let [newItems, hasMore] = await this.service.loadMoreFollowees(authToken, user, PAGE_SIZE, this.lastItem);
    
            this.hasMoreItems = hasMore;
            this.lastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load followee because of exception: ${error}`
          );
        }
    };
}