import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {

    public constructor(view: AuthView) {
      super(view)
    }

    protected get view(): AuthView {
      return super.view as AuthView;
    }

    public async doLogin (alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
      this.doAuthentication(
        rememberMe,
        "login user",
        () => this.service.login(alias, password),
        () => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }}
      )
    }
}