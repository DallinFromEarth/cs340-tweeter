import { IsFollowerRequest, IsFollowerResponse, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: IsFollowerRequest): Promise<IsFollowerResponse> => {
    const userService = new UserService();
    const isFollower = await userService.getIsFollowerStatus(
        request.token,
        request.userAlias,
        User.fromDTO(request.selectedUser)
    ) 

    return {
        success: true,
        message: "Posted!",
        isFollower: isFollower
    }
}