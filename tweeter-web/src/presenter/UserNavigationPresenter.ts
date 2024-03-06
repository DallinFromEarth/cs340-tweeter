import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View{
    setDisplayedUser: (user: User) => void
}

export class UserNavigationPresenter extends Presenter{
    private service: UserService;
    
    public constructor(view: UserNavigationView) {
      super(view)
      this.service = new UserService;
    }

    public async navigateToUser(authToken: AuthToken, currentUser: User, aliasString: string) {
        try {
            let alias = this.extractAlias(aliasString);
      
            let user = await this.service.getUser(authToken!, alias);
      
            if (!!user) {
              if (currentUser!.equals(user)) {
                this.view.setDisplayedUser(currentUser!);
              } else {
                this.view.setDisplayedUser(user);
              }
            }
          } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
          }
    }

    private extractAlias(value: string): string {
        let index = value.indexOf("@");
        return value.substring(index);
      };
}