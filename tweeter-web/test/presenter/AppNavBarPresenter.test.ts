import { AuthToken } from "tweeter-shared";
import { AppNavBarPresenter, AppNavBarView } from "../../src/presenter/AppNavBarPresenter"
import { anything, instance, mock, spy, verify, when } from "ts-mockito"
import { UserService } from "../../src/model/service/UserService";

describe("AppNavBarPresenter", () => {
    let mockAppNavbarView: AppNavBarView;
    let appNavbarPresenter: AppNavBarPresenter;
    let mockUserService: UserService;
    const authToken = new AuthToken("cheeseMcGeeToken", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavBarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView)

        const AppNavbarPresenterSpy = spy(new AppNavBarPresenter(mockAppNavbarViewInstance))
        appNavbarPresenter = instance(AppNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService)

        when(AppNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
    })

    it("tell view to display a logging out message", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with correct authToken", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(mockUserService.logout(authToken)).once();
    })

    it("tell view to clear last info message, clear user info, naviagte to login page", async () => {
        await appNavbarPresenter.logout(authToken);

        verify(mockAppNavbarView.clearLastInfoMessage()).once()
        verify(mockAppNavbarView.clearUserInfo()).once()
        verify(mockAppNavbarView.displayErrorMessage(anything())).never()

    })

    it("displays an error message and does not clear the info message nor user info, nor navigate to login page when logout fails", async () => {
        const error = new Error( "an error occured, dun dun dunnnnn" );
        when(mockUserService.logout(anything())).thenThrow(error);

        await appNavbarPresenter.logout(authToken);

        verify(mockAppNavbarView.displayErrorMessage(anything())).once()
        verify(mockAppNavbarView.clearLastInfoMessage()).never()
        verify(mockAppNavbarView.clearUserInfo()).never()
    })
});