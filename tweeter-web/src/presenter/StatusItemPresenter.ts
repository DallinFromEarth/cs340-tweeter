import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface StatusItemView extends View {
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter {
    private _hasMoreItems: boolean = true;

    protected constructor(view: StatusItemView) {
        super(view)
    }

    public get hasMoreItems() {
        return this._hasMoreItems
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value
    }
    
    public abstract loadMoreItems(authToken: AuthToken, displayedUser: User): void;
}