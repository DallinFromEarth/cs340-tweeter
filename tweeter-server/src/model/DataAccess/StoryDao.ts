export interface StoryDao {
    addStory(alias: string, post: string): Promise<void>
    getStoriesForUser(alias: string): Promise<any[]>
}
