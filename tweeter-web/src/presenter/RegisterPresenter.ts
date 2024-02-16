import { NavigateOptions, To } from "react-router-dom";
import { UserService } from "../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";

export interface RegisterView {
    navigate: (to: To, options?: NavigateOptions | undefined) => void;
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
}

export class RegisterPresenter {
    private service: UserService;
    private view: RegisterView;

    public constructor(view: RegisterView) {
        this.service = new UserService();
        this.view = view
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        rememberMe: boolean
        ) {
        try {
            let [user, authToken] = await this.service.register(
              firstName,
              lastName,
              alias,
              password,
              imageBytes
            );
      
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate("/");
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to register user because of exception: ${error}`
            );
          }
    }
}