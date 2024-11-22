import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
    const userService = new UserService();
    const [user, authToken] =  await userService.register(
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