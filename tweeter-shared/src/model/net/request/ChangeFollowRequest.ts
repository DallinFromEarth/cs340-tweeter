import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface ChangeFollowRequest extends TweeterRequest {
    userToFollowOrNot: UserDTO,
}