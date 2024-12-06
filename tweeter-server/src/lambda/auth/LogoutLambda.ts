import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import {AuthService} from "../../model/service/AuthService";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
    const authService = new AuthService();
    await authService.logout(
        request.token
    )

    return {
        success: true,
        message: "Logged out"
    }
}
