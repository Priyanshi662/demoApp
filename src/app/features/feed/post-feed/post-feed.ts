import { Component, inject, OnInit, signal } from '@angular/core';
import { Post } from '../post/post';
import { MatCardModule } from '@angular/material/card';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../core/post-service';
import { PostType } from '../../../shared/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-feed',
  imports: [Post, MatCardModule, LucideAngularModule, ReactiveFormsModule, CommonModule],
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.css',
})
export class PostFeed implements OnInit{
addIcon = Plus;

  private postService = inject(PostService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  posts = signal<PostType[]>([]);
  showForm = signal(false);
  editingPost = signal<PostType | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  operationError = signal<string | null>(null);
  isSubmitting = signal(false);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      body: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.postService.getAllPosts().subscribe({
      next: posts => {
        this.posts.set(posts);
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set('Failed to load posts. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  onAdd(): void {
    this.editingPost.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  onEdit(post: PostType): void {
    this.editingPost.set(post);
    this.form.patchValue(post);
    this.showForm.set(true);
  }

  onDelete(id: number): void {
    this.operationError.set(null);
    if (confirm('Are you sure you want to delete this post?')) {
    this.postService.deletePost(id).subscribe({
      next: () => {
        this.loadPosts();
      },
      error: err => {
        this.operationError.set('Failed to delete post. Please try again.');
      }
    });
  }
  }

  onComments(post: PostType): void {
    // Handle comments, perhaps navigate or show modal
    this.router.navigate(['/feed/comments'], { 
      queryParams: { postId: post.id } 
    });
  }
  
  onViewPost(post: PostType): void {
    this.router.navigate(['/feed/post', post.id]);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.operationError.set(null);
      this.isSubmitting.set(true);
      const formValue = this.form.value;
      if (this.editingPost()) {
        this.postService.updatePost(this.editingPost()!.id, formValue).subscribe({
          next: () => {
            this.loadPosts();
            this.showForm.set(false);
            this.isSubmitting.set(false);
          },
          error: err => {
            this.operationError.set('Failed to update post. Please try again.');
            this.isSubmitting.set(false);
          }
        });
      } else {
        this.postService.createPost(formValue).subscribe({
          next: () => {
            this.loadPosts();
            this.showForm.set(false);
            this.isSubmitting.set(false);
          },
          error: err => {
            this.operationError.set('Failed to create post. Please try again.');
            this.isSubmitting.set(false);
          }
        });
      }
    }
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.operationError.set(null);
  }
}
