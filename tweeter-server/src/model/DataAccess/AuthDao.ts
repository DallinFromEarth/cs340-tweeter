export interface AuthDao {
    addAuth(token: string, user_handle: string): Promise<void>

    /**
     * return a user handler if the token is valid, return null if it's not valid
     * @param token
     */
    getUserByToken(token: string): Promise<string | null>
    refreshToken(token: string): Promise<void>
    deleteToken(token: string): Promise<void>
}
