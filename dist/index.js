"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTokenInterceptor = exports.useAuthTokenInterceptor = exports.applyAuthTokenInterceptor = exports.refreshTokenIfNeeded = exports.getAccessToken = exports.getRefreshToken = exports.clearAuthTokens = exports.setAccessToken = exports.setAuthTokens = exports.isLoggedIn = exports.STORAGE_KEY = void 0;
var jwt_decode_1 = __importDefault(require("jwt-decode"));
// a little time before expiration to try refresh (seconds)
var EXPIRE_FUDGE = 10;
exports.STORAGE_KEY = "auth-token-" + process.env.NODE_ENV;
var accessToken = null;
// EXPORTS
/**
 * Checks if refresh tokens are stored
 * @returns Whether the user is logged in or not
 */
var isLoggedIn = function () {
    var token = exports.getRefreshToken();
    return !!token;
};
exports.isLoggedIn = isLoggedIn;
/**
 * Sets the access and refresh tokens
 * @param {IAuthTokens} tokens - Access and Refresh tokens
 */
var setAuthTokens = function (tokens) {
    accessToken = tokens.accessToken;
    localStorage.setItem(exports.STORAGE_KEY, tokens.refreshToken);
};
exports.setAuthTokens = setAuthTokens;
/**
 * Sets the access token
 * @param {string} token - Access token
 */
var setAccessToken = function (token) {
    var tokens = getAuthTokens();
    if (!tokens) {
        throw new Error('Unable to update access token since there are not tokens currently stored');
    }
    accessToken = token;
};
exports.setAccessToken = setAccessToken;
/**
 * Clears both tokens
 */
var clearAuthTokens = function () {
    accessToken = null;
    localStorage.removeItem(exports.STORAGE_KEY);
};
exports.clearAuthTokens = clearAuthTokens;
/**
 * Returns the stored refresh token
 * @returns {string} Refresh token
 */
var getRefreshToken = function () {
    var tokens = getAuthTokens();
    return tokens ? tokens.refreshToken : undefined;
};
exports.getRefreshToken = getRefreshToken;
/**
 * Returns the stored access token
 * @returns {string} Access token
 */
var getAccessToken = function () { return (accessToken ? accessToken : undefined); };
exports.getAccessToken = getAccessToken;
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
var refreshTokenIfNeeded = function (requestRefresh) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!accessToken || isTokenExpired(accessToken))) return [3 /*break*/, 2];
                return [4 /*yield*/, refreshToken(requestRefresh)];
            case 1:
                // do refresh
                accessToken = _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, accessToken];
        }
    });
}); };
exports.refreshTokenIfNeeded = refreshTokenIfNeeded;
/**
 *
 * @param {Axios} axios - Axios instance to apply the interceptor to
 * @param {IAuthTokenInterceptorConfig} config - Configuration for the interceptor
 */
var applyAuthTokenInterceptor = function (axios, config) {
    if (!axios.interceptors)
        throw new Error("invalid axios instance: " + axios);
    axios.interceptors.request.use(exports.authTokenInterceptor(config));
};
exports.applyAuthTokenInterceptor = applyAuthTokenInterceptor;
/**
 * @deprecated This method has been renamed to applyAuthTokenInterceptor and will be removed in a future release.
 */
exports.useAuthTokenInterceptor = exports.applyAuthTokenInterceptor;
// PRIVATE
/**
 *  Returns the refresh and access tokens
 * @returns {IAuthTokens} Object containing refresh and access tokens
 */
var getAuthTokens = function () {
    var refreshToken = localStorage.getItem(exports.STORAGE_KEY);
    if (!refreshToken || !accessToken)
        return;
    return { accessToken: accessToken, refreshToken: refreshToken };
};
/**
 * Checks if the token is undefined, has expired or is about the expire
 *
 * @param {string} token - Access token
 * @returns Whether or not the token is undefined, has expired or is about the expire
 */
var isTokenExpired = function (token) {
    if (!token)
        return true;
    var expiresIn = getExpiresIn(token);
    return !expiresIn || expiresIn <= EXPIRE_FUDGE;
};
/**
 * Gets the unix timestamp from an access token
 *
 * @param {string} token - Access token
 * @returns {string} Unix timestamp
 */
var getTimestampFromToken = function (token) {
    var decoded = jwt_decode_1.default(token);
    return decoded === null || decoded === void 0 ? void 0 : decoded.exp;
};
/**
 * Returns the number of seconds before the access token expires or -1 if it already has
 *
 * @param {string} token - Access token
 * @returns {number} Number of seconds before the access token expires
 */
var getExpiresIn = function (token) {
    var expiration = getTimestampFromToken(token);
    if (!expiration)
        return -1;
    return expiration - Date.now() / 1000;
};
/**
 * Refreshes the access token using the provided function
 *
 * @param {requestRefresh} requestRefresh - Function that is used to get a new access token
 * @returns {string} - Fresh access token
 */
var refreshToken = function (requestRefresh) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, newTokens, error_1, status_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                refreshToken = exports.getRefreshToken();
                if (!refreshToken)
                    throw new Error('No refresh token available');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, 8, 9]);
                isRefreshing = true;
                return [4 /*yield*/, requestRefresh(refreshToken)];
            case 2:
                newTokens = _b.sent();
                if (!(typeof newTokens === 'object' && (newTokens === null || newTokens === void 0 ? void 0 : newTokens.accessToken))) return [3 /*break*/, 4];
                return [4 /*yield*/, exports.setAuthTokens(newTokens)];
            case 3:
                _b.sent();
                return [2 /*return*/, newTokens.accessToken];
            case 4:
                if (!(typeof newTokens === 'string')) return [3 /*break*/, 6];
                return [4 /*yield*/, exports.setAccessToken(newTokens)];
            case 5:
                _b.sent();
                return [2 /*return*/, newTokens];
            case 6: throw new Error('requestRefresh must either return a string or an object with an accessToken');
            case 7:
                error_1 = _b.sent();
                status_1 = (_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _a === void 0 ? void 0 : _a.status;
                if (status_1 === 401 || status_1 === 422) {
                    // The refresh token is invalid so remove the stored tokens
                    localStorage.removeItem(exports.STORAGE_KEY);
                    accessToken = null;
                    throw new Error("Got " + status_1 + " on token refresh; clearing both auth tokens");
                }
                else {
                    // A different error, probably network error
                    throw new Error("Failed to refresh auth token: " + error_1.message);
                }
                return [3 /*break*/, 9];
            case 8:
                isRefreshing = false;
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); };
/**
 * Function that returns an Axios Intercepter that:
 * - Applies that right auth header to requests
 * - Refreshes the access token when needed
 * - Puts subsequent requests in a queue and executes them in order after the access token has been refreshed.
 *
 * @param {IAuthTokenInterceptorConfig} config - Configuration for the interceptor
 * @returns {Promise} Promise that resolves in the supplied requestConfig
 */
var authTokenInterceptor = function (_a) {
    var _b = _a.header, header = _b === void 0 ? 'Authorization' : _b, _c = _a.headerPrefix, headerPrefix = _c === void 0 ? 'Bearer ' : _c, requestRefresh = _a.requestRefresh;
    return function (requestConfig) { return __awaiter(void 0, void 0, void 0, function () {
        var accessToken, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // We need refresh token to do any authenticated requests
                    if (!exports.getRefreshToken())
                        return [2 /*return*/, requestConfig
                            // Queue the request if another refresh request is currently happening
                        ];
                    // Queue the request if another refresh request is currently happening
                    if (isRefreshing) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                queue.push({ resolve: resolve, reject: reject });
                            })
                                .then(function (token) {
                                if (requestConfig.headers) {
                                    requestConfig.headers[header] = "" + headerPrefix + token;
                                }
                                return requestConfig;
                            })
                                .catch(Promise.reject)];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports.refreshTokenIfNeeded(requestRefresh)];
                case 2:
                    accessToken = _a.sent();
                    resolveQueue(accessToken);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    if (error_2 instanceof Error) {
                        declineQueue(error_2);
                        throw new Error("Unable to refresh access token for request due to token refresh error: " + error_2.message);
                    }
                    return [3 /*break*/, 4];
                case 4:
                    // add token to headers
                    if (accessToken && requestConfig.headers)
                        requestConfig.headers[header] = "" + headerPrefix + accessToken;
                    return [2 /*return*/, requestConfig];
            }
        });
    }); };
};
exports.authTokenInterceptor = authTokenInterceptor;
var isRefreshing = false;
var queue = [];
/**
 * Function that resolves all items in the queue with the provided token
 * @param token New access token
 */
var resolveQueue = function (token) {
    queue.forEach(function (p) {
        p.resolve(token);
    });
    queue = [];
};
/**
 * Function that declines all items in the queue with the provided error
 * @param error Error
 */
var declineQueue = function (error) {
    queue.forEach(function (p) {
        p.reject(error);
    });
    queue = [];
};
//# sourceMappingURL=index.js.map