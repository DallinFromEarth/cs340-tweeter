import { AuthRequest, AuthResponse } from "tweeter-shared";
import {AuthService} from "../../model/service/AuthService";

export const handler = async (request: AuthRequest): Promise<AuthResponse> => {
    const authService = new AuthService();
    const [user, authToken] =  await authService.login(
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
