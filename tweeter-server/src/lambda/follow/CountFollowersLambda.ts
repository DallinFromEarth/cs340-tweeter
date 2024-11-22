import { CountResponse, TweeterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: TweeterRequest): Promise<CountResponse> => {
    const userService = new UserService();
    const count =  await userService.getFollowersCount(
        request.token,
        request.userAlias
    ) 

    return {
        success: true,
        message: null,
        count: count
    }
}