import {StatusDTO} from "tweeter-shared";

export interface FeedDao {
    addToFeed(followerAlias: string, followeeAlias: string, timestamp: number, post: string): Promise<void>
    getNextFeedPage(followerAlias: string, pageSize: number, lastStatus?: StatusDTO): Promise<[any[], boolean]>
    batchAddToFeed(updates: { followerAlias: string, followeeAlias: string, timestamp: number, post: string }[]): Promise<void>
}
