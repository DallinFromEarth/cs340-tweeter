import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<T> extends TweeterResponse {
    readonly items: T [],
    readonly hasMore: boolean,
}