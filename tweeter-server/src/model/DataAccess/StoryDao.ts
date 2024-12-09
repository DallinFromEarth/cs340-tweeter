export interface StoryDao {
    addStory(alias: string, post: string): Promise<void>
    getStoriesForUser(alias: string): Promise<any[]>
    getNextStoriesPage(alias: string, pageSize: number, lastTimestamp?: number): Promise<[any[], boolean]>
}
