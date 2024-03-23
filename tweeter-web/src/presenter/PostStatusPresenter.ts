import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter, View } from "./Presenter";

export class PostStatusPresenter extends Presenter {
    private _service: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this._service = new StatusService();
    }

    public get view() {
        return super.view as PostStatusView
    }

    public get service() {
        return this._service;
    }

    public submitPost(post: string, authToken: AuthToken, currentUser: User) {
        this.doFailureReportinOperation( async () => {
            this.view.displayInfoMessage("Posting status...", 0);
      
            let status = new Status(post, currentUser, Date.now());
      
            await this.service.postStatus(authToken, status);
      
            this.view.clearLastInfoMessage();
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status")
    }
}

export interface PostStatusView extends MessageView {
    setPost: React.Dispatch<React.SetStateAction<string>>
}