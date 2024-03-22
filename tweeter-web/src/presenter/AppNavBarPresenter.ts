import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export class AppNavBarPresenter extends Presenter{ 
    private _service: UserService | null = null;

    public constructor(view: AppNavBarView) {
        super(view);
    }

    public get view() {
        return super.view as AppNavBarView
    }

    public get service(): UserService {
        if(this._service == null) {
            this._service = new UserService();
        }
        return this._service;
    }

    public async logout(authToken: AuthToken | null): Promise<void> {
        this.view.displayInfoMessage("Logging Out...", 0);

        this.doFailureReportinOperation(async () => {
            await this.service.logout(authToken!)

            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log out")
    }
}

export interface AppNavBarView extends MessageView {
    clearUserInfo: () => void;
    navigateToLogin: () => void;
}