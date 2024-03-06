import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export interface UserInfoView extends MessageView {
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>,
    setFolloweesCount: React.Dispatch<React.SetStateAction<number>>
    setFollowersCount: React.Dispatch<React.SetStateAction<number>>
}

export class UserInfoPresenter extends Presenter {
    private service: UserService;

    public constructor(view: UserInfoView) {
      super(view)
      this.service = new UserService();
    }

    protected get view(): UserInfoView {
      return super.view as UserInfoView;
    }

    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        this.doFailureReportinOperation(async () => {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(
              await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        }, "determine follower status")
    };

    public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
          );
        }
    };
    
    public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
          this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
          );
        }
    };

    public async followUser(authToken: AuthToken, user: User) {
        try {
            this.view.displayInfoMessage(`Adding ${user!.name} to followers...`, 0);
      
            let [followersCount, followeesCount] = await this.service.follow(
              authToken,
              user
            );
      
            this.view.clearLastInfoMessage();
      
            this.view.setIsFollower(true);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to follow user because of exception: ${error}`
            );
          }
    }

    public async unfollowUser(authToken: AuthToken, user: User) {
        try {
            this.view.displayInfoMessage(
              `Removing ${user!.name} from followers...`,
              0
            );
      
            let [followersCount, followeesCount] = await this.service.unfollow(
              authToken!,
              user!
            );
      
            this.view.clearLastInfoMessage();
      
            this.view.setIsFollower(false);
            this.view.setFollowersCount(followersCount);
            this.view.setFolloweesCount(followeesCount);
          } catch (error) {
            this.view.displayErrorMessage(
              `Failed to unfollow user because of exception: ${error}`
            );
          }
    }

    
}