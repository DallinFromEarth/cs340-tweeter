import { TweeterRequest } from "./TweeterRequest";

export interface AuthRequest extends TweeterRequest {
    password: string
}