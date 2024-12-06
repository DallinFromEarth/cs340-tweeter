import { AuthResponse, RegisterRequest } from "tweeter-shared";
import {AuthService} from "../../model/service/AuthService";

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
    const authService = new AuthService();
    const [user, authToken] =  await authService.register(
        request.firstName,
        request.lastName,
        request.userAlias,
        request.password,
        request.userImage
    ) 

    return {
        success: true,
        message: null,
        authToken: authToken,
        user: user.dto()
    }
}
