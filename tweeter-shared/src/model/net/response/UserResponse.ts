import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface UserResponse extends TweeterResponse {
    user: UserDTO | null
}