export interface FollowDao {
    /**
     * Follower will now be following followee
     * @param follower_handle the user making the request
     * @param followee_handle the user that will now be followed
     */
    addFollower(follower_handle: String, followee_handle: String): Promise<void>
}
