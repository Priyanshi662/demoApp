
export interface CommentType{
    postId:number,
    id:number,
    name:string,
    email:string,
    body:string
}
export enum CommentErrorType {
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Standardized error structure for comment operations
 */
export interface CommentError {
  type: CommentErrorType;
  message: string;
  statusCode?: number;
}