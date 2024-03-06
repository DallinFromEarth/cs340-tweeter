import { NavigateOptions, To } from "react-router-dom"
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View{
    navigate: (to: To, options?: NavigateOptions | undefined) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
}

export class LoginPresenter extends Presenter {
    private service: UserService;

    public constructor(view: LoginView) {
      super(view)
      this.service = new UserService();
    }

    public async doLogin (alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
        try {
            let [user, authToken] = await this.service.login(alias, password);
      
            this.view.updateUserInfo(user, user, authToken, rememberMe);
      
            if (!!originalUrl) {
              this.view.navigate(originalUrl);
            } else {
              this.view.navigate("/");
            }
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to log user in because of exception: ${error}`
            );
          }
    }
}