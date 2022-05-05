import { AxiosInstance, AxiosRequestConfig } from 'axios';
export declare const STORAGE_KEY: string;
declare type Token = string;
export interface IAuthTokens {
    accessToken: Token;
    refreshToken: Token;
}
/**
 * Checks if refresh tokens are stored
 * @returns Whether the user is logged in or not
 */
export declare const isLoggedIn: () => boolean;
/**
 * Sets the access and refresh tokens
 * @param {IAuthTokens} tokens - Access and Refresh tokens
 */
export declare const setAuthTokens: (tokens: IAuthTokens) => void;
/**
 * Sets the access token
 * @param {string} token - Access token
 */
export declare const setAccessToken: (token: Token) => void;
/**
 * Clears both tokens
 */
export declare const clearAuthTokens: () => void;
/**
 * Returns the stored refresh token
 * @returns {string} Refresh token
 */
export declare const getRefreshToken: () => Token | undefined;
/**
 * Returns the stored access token
 * @returns {string} Access token
 */
export declare const getAccessToken: () => Token | undefined;
/**
 * @callback requestRefresh
 * @param {string} refreshToken - Token that is sent to the backend
 * @returns {Promise} Promise that resolves in an access token
 */
/**
 * Gets the current access token, exchanges it with a new one if it's expired and then returns the token.
 * @param {requestRefresh} requestRefresh - Function that is used to get a new access token
 * @returns {string} Access token
 */
export declare const refreshTokenIfNeeded: (requestRefresh: TokenRefreshRequest) => Promise<Token | undefined>;
/**
 *
 * @param {Axios} axios - Axios instance to apply the interceptor to
 * @param {IAuthTokenInterceptorConfig} config - Configuration for the interceptor
 */
export declare const applyAuthTokenInterceptor: (axios: AxiosInstance, config: IAuthTokenInterceptorConfig) => void;
/**
 * @deprecated This method has been renamed to applyAuthTokenInterceptor and will be removed in a future release.
 */
export declare const useAuthTokenInterceptor: (axios: AxiosInstance, config: IAuthTokenInterceptorConfig) => void;
export declare type TokenRefreshRequest = (refreshToken: Token) => Promise<Token | IAuthTokens>;
export interface IAuthTokenInterceptorConfig {
    header?: string;
    headerPrefix?: string;
    requestRefresh: TokenRefreshRequest;
}
/**
 * Function that returns an Axios Intercepter that:
 * - Applies that right auth header to requests
 * - Refreshes the access token when needed
 * - Puts subsequent requests in a queue and executes them in order after the access token has been refreshed.
 *
 * @param {IAuthTokenInterceptorConfig} config - Configuration for the interceptor
 * @returns {Promise} Promise that resolves in the supplied requestConfig
 */
export declare const authTokenInterceptor: ({ header, headerPrefix, requestRefresh, }: IAuthTokenInterceptorConfig) => (requestConfig: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
export {};
//# sourceMappingURL=index.d.ts.map