export interface PostType {
    userId: number;
    id: number;
    title: string;
    body: string;
}
export enum PostErrorType {
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Standardized error structure for post operations
 */
export interface PostError {
  type: PostErrorType;
  message: string;
  statusCode?: number;
}