import { AuthToken } from "../../domain/AuthToken";
import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthResponse extends TweeterResponse {
    user: UserDTO,
    authToken: AuthToken
}