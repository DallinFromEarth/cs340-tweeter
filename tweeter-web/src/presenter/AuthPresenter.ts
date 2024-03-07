import { NavigateOptions, To } from "react-router-dom";
import { Presenter, View } from "./Presenter";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export abstract class AuthPresenter extends Presenter {
    protected service: UserService;

    public constructor(view: AuthView) {
        super(view);
        this.service = new UserService();
    }
    
    protected get view(): AuthView {
        return super.view as AuthView;
    }

    protected updateUserInfo(currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) {
        return this.view.updateUserInfo(currentUser, displayedUser, authToken, remember)
    }

    protected async doAuthentication(rememberMe: boolean, 
                                    operationDescription: string, 
                                    authenticate: () => Promise<[User, AuthToken]>,
                                    navigate: () => void): Promise<void> {
        this.doFailureReportinOperation( async () => {
            let [user, authToken] = await authenticate();
      
            this.updateUserInfo(user, user, authToken, rememberMe);
            navigate();
          }, operationDescription)
    }

}

export interface AuthView extends View {
    navigate: (to: To, options?: NavigateOptions | undefined) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
}