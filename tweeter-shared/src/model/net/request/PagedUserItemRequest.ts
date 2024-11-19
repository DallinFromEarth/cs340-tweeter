import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest{
    readonly pageSize: number,
    readonly lastItem: UserDTO | null,
}