import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";

interface UserNavigator {
    navigateToUser: (event: React.MouseEvent) => Promise<void>
}

const useUserNavigation = (): UserNavigator => {
    const { setDisplayedUser, currentUser, authToken } =
    useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const listener: UserNavigationView = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage,
    }
    
    const presenter = new UserNavigationPresenter(listener)

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenter.navigateToUser(authToken!, currentUser!, event.target.toString())
      };

      return {
        navigateToUser: navigateToUser,
      }
}

export default useUserNavigation
