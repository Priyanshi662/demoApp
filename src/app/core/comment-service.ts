import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CommentError, CommentErrorType, CommentType } from '../shared/comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/comments';
  /**
   * Fetches all posts for a specific user
   * @param userId - The user ID
   * @returns Observable of posts array belonging to the user
   */
  getCommentsByPostId(postId: number): Observable<CommentType[]> {
    return this.http.get<CommentType[]>(this.baseUrl, {
      params: { postId: postId.toString() }
    }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

   /**
   * Creates a new comment
   * @param comment - The comment data
   * @returns Observable of the created comment
   */
  createComment(comment: Partial<CommentType>): Observable<CommentType> {
    return this.http.post<CommentType>(`${this.baseUrl}/comments`, comment).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Updates an existing comment
   * @param id - The comment ID
   * @param comment - The updated comment data
   * @returns Observable of the updated comment
   */
  updateComment(id: number, comment: Partial<CommentType>): Observable<CommentType> {
    return this.http.put<CommentType>(`${this.baseUrl}/comments/${id}`, comment).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Partially updates an existing comment
   * @param id - The comment ID
   * @param comment - The partial comment data
   * @returns Observable of the updated comment
   */
  patchComment(id: number, comment: Partial<CommentType>): Observable<CommentType> {
    return this.http.patch<CommentType>(`${this.baseUrl}/comments/${id}`, comment).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

    /**
   * Deletes a comment
   * @param id - The comment ID
   * @returns Observable of void
   */
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${id}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

   private handleError(error: HttpErrorResponse): CommentError {
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        return {
          type: CommentErrorType.NETWORK_ERROR,
          message: `Network error: ${error.error.message}`
        };
      }
  
      // Server-side error
      switch (error.status) {
        case 404:
          return {
            type: CommentErrorType.NOT_FOUND,
            message: 'The requested post was not found',
            statusCode: error.status
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: CommentErrorType.SERVER_ERROR,
            message: `Server error: ${error.statusText || 'Internal Server Error'}`,
            statusCode: error.status
          };
        case 0:
          return {
            type: CommentErrorType.NETWORK_ERROR,
            message: 'Unable to connect to the server. Please check your network connection.',
            statusCode: error.status
          };
        default:
          return {
            type: CommentErrorType.UNKNOWN_ERROR,
            message: `Request failed with status ${error.status}: ${error.statusText || 'Unknown error'}`,
            statusCode: error.status
          };
      }
    }
}

