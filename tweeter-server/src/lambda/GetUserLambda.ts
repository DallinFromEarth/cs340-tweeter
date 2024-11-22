import { TweeterRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (request: TweeterRequest): Promise<UserResponse> => {
    const userService = new UserService();
    const response = await userService.getUser(
        request.token,
        request.userAlias
    ) 

    return {
        success: true,
        message: "Followed!",
        user: response ? response.dto() : null
    }
}