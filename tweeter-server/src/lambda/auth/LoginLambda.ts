import { AuthRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: AuthRequest): Promise<AuthResponse> => {
    const userService = new UserService();
    const [user, authToken] =  await userService.login(
        request.userAlias,
        request.password,
    ) 

    return {
        success: true,
        message: null,
        authToken: authToken,
        user: user.dto()
    }
}