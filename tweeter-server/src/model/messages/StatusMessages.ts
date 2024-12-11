export interface PostStatusMessage {
    authorAlias: string;
    post: string;
    timestamp: number;
}

export interface UpdateFeedBatchMessage {
    authorAlias: string;
    post: string;
    timestamp: number;
    followerAliases: string[];
}
