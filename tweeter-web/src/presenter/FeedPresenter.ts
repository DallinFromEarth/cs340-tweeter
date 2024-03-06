import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { PAGE_SIZE, StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
    private service: StatusService;

    private lastItem: Status | null = (null);

    public constructor(view: StatusItemView) {
        super(view)
        this.service = new StatusService;
    }

    protected get view(): StatusItemView {
      return super.view as StatusItemView;
    }

    public async loadMoreItems(authToken: AuthToken, user: User) {
        try {
          if (this.hasMoreItems) {
            let [newItems, hasMore] = await this.service.loadMoreFeedItems(authToken, user, PAGE_SIZE, this.lastItem)
    
            this.hasMoreItems = hasMore;
            this.lastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load feed items because of exception: ${error}`
          );
        }
    };
}