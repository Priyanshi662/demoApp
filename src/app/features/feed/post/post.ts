import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { LucideAngularModule, X, Pen} from 'lucide-angular';
import { PostService } from '../../../core/post-service';
import { PostType } from '../../../shared/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  imports: [HlmCardImports,LucideAngularModule, CommonModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post implements OnInit {
  private readonly postService = inject(PostService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  cross = X;
  editIcon = Pen;
     
  post = input<PostType>();
  edit = output<PostType>();
  delete = output<number>();
  comments = output<PostType>();
  
  // For standalone route usage
  loadedPost = signal<PostType | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    // If used as a route component (has route param but no input)
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId && !this.post()) {
      this.loadPost(Number(postId));
    }
  }
  
  loadPost(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.postService.getPost(id).subscribe({
      next: (post: PostType) => {
        this.loadedPost.set(post);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Failed to load post. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
  
  getPost(): PostType | null | undefined {
    return this.post() || this.loadedPost();
  }
  
  onEdit(event?: Event): void {
    const currentPost = this.getPost();
    if (currentPost) {
      if (event) {
        event.stopPropagation();
      }
      this.edit.emit(currentPost);
    }
  }
  
  onDelete(event?: Event): void {
    const currentPost = this.getPost();
    if (currentPost && confirm('Are you sure you want to delete this post?')) {
      if (event) {
        event.stopPropagation();
      }
      this.postService.deletePost(currentPost.id).subscribe({
        next: () => {
          this.router.navigate(['/feed']);
        },
        error: (err: any) => {
          this.error.set('Failed to delete post. Please try again.');
        }
      });
    }
  }
  goToFeed():void{
    this.router.navigate(['/feed']);
  }
  onComments(): void {
    const currentPost = this.getPost();
    if (currentPost) {
      this.router.navigate(['/feed/comments'], { 
        queryParams: { postId: currentPost.id } 
      });
    }
  }
}
