import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface UserItemView extends View {
    addItems: (items: User[]) => void;
}

export abstract class UserItemPresenter extends Presenter {
    private _hasMoreItems: boolean = true;
    
    protected constructor(view: UserItemView) {
        super(view);
    }

    public get hasMoreItems() {
        return this._hasMoreItems
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value
    }

    public abstract loadMoreItems(authToken: AuthToken, displayedUser: User): void;
}