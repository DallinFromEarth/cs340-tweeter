export interface FollowDao {
    /**
     * Follower will now be following followee
     * @param follower_handle the user making the request
     * @param followee_handle the user that will now be followed
     */
    addFollower(follower_handle: String, followee_handle: String): Promise<void>
    removeFollower(follower_handle: String, followee_handle: String): Promise<void>
    getFollowingCount(follower_handle: String): Promise<number>
    getFollowerCount(followee_handle: String): Promise<number>
    isFollowing(follower_handle: String, followee_handle: String): Promise<boolean>
    getNextFollowersPage(followee_handle: String, pageSize: number, lastUserAlias?: String): Promise<[String[], boolean]>
    getNextFolloweesPage(follower_handle: String, pageSize: number, lastUserAlias?: String): Promise<[String[], boolean]>
}
