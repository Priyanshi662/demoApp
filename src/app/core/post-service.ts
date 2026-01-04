import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PostType, PostError, PostErrorType } from '../shared/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  /**
   * Fetches all posts
   * @returns Observable of posts array
   */
  getAllPosts(): Observable<PostType[]> {
    return this.http.get<PostType[]>(this.baseUrl).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Fetches a single post by ID
   * @param id - The post ID
   * @returns Observable of the post
   */
  getPost(id: number): Observable<PostType> {
    return this.http.get<PostType>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  
  /**
   * Fetches all posts for a specific user
   * @param userId - The user ID
   * @returns Observable of posts array belonging to the user
   */
  getPostsByUserId(userId: number): Observable<PostType[]> {
    return this.http.get<PostType[]>(this.baseUrl, {
      params: { userId: userId.toString() }
    }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Creates a new post
   * @param post - The post data (title and body)
   * @returns Observable of the created post
   */
  createPost(post: Partial<PostType>): Observable<PostType> {
    return this.http.post<PostType>(this.baseUrl, post).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Updates an existing post
   * @param id - The post ID
   * @param post - The updated post data
   * @returns Observable of the updated post
   */
  updatePost(id: number, post: Partial<PostType>): Observable<PostType> {
    return this.http.put<PostType>(`${this.baseUrl}/${id}`, post).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Partially updates an existing post
   * @param id - The post ID
   * @param post - The partial post data
   * @returns Observable of the updated post
   */
  patchPost(id: number, post: Partial<PostType>): Observable<PostType> {
    return this.http.patch<PostType>(`${this.baseUrl}/${id}`, post).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Deletes a post
   * @param id - The post ID
   * @returns Observable of void
   */
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => this.handleError(error)))
    );
  }

  /**
   * Handles HTTP errors and creates appropriate PostError objects
   * @param error - HttpErrorResponse object
   * @returns PostError object
   */
  private handleError(error: HttpErrorResponse): PostError {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      return {
        type: PostErrorType.NETWORK_ERROR,
        message: `Network error: ${error.error.message}`
      };
    }

    // Server-side error
    switch (error.status) {
      case 404:
        return {
          type: PostErrorType.NOT_FOUND,
          message: 'The requested post was not found',
          statusCode: error.status
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: PostErrorType.SERVER_ERROR,
          message: `Server error: ${error.statusText || 'Internal Server Error'}`,
          statusCode: error.status
        };
      case 0:
        return {
          type: PostErrorType.NETWORK_ERROR,
          message: 'Unable to connect to the server. Please check your network connection.',
          statusCode: error.status
        };
      default:
        return {
          type: PostErrorType.UNKNOWN_ERROR,
          message: `Request failed with status ${error.status}: ${error.statusText || 'Unknown error'}`,
          statusCode: error.status
        };
    }
  }
}