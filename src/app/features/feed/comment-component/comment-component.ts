import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { LucideAngularModule, ArrowLeft, Plus, Pen, Trash2 } from 'lucide-angular';
import { CommentService } from '../../../core/comment-service';
import { CommentType } from '../../../shared/comments.model';

@Component({
  selector: 'app-comment-component',
  imports: [CommonModule, MatCardModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './comment-component.html',
  styleUrl: './comment-component.css',
})
export class CommentComponent implements OnInit {
  private commentService = inject(CommentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Icons
  backIcon = ArrowLeft;
  addIcon = Plus;
  editIcon = Pen;
  deleteIcon = Trash2;

  // Signals
  comments = signal<CommentType[]>([]);
  postId = signal<number | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingComment = signal<CommentType | null>(null);
  isSubmitting = signal(false);
  operationError = signal<string | null>(null);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const postId = params['postId'];
      if (postId) {
        this.postId.set(+postId);
        this.loadComments(+postId);
      }
    });
  }

  loadComments(postId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.commentService.getCommentsByPostId(postId).subscribe({
      next: comments => {
        this.comments.set(comments);
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set('Failed to load comments. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  onAddComment(): void {
    this.editingComment.set(null);
    this.form.reset();
    this.showForm.set(true);
    this.operationError.set(null);
  }

  onEditComment(comment: CommentType): void {
    this.editingComment.set(comment);
    this.form.patchValue(comment);
    this.showForm.set(true);
    this.operationError.set(null);
  }

  onDeleteComment(id: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(id).subscribe({
          next: ()=>{
            this.loadComments(+this.postId);
          },
          error:()=>{
            this.error.set('Failed to delete comment!');
          }
      })
      console.log('Delete comment:', id);
      // Remove from local state for demo
      this.comments.set(this.comments().filter(c => c.id !== id));
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting.set(true);
      this.operationError.set(null);
      
      const formValue = {
        ...this.form.value,
        postId: this.postId()
      };

      // Simulate API call - implement actual service methods
     if (this.editingComment()) {
        this.commentService.updateComment(this.editingComment()!.id, formValue).subscribe({
          next: () => {
            this.loadComments(+this.postId);
            this.showForm.set(false);
            this.isSubmitting.set(false);
          },
          error: err => {
            this.operationError.set('Failed to update post. Please try again.');
            this.isSubmitting.set(false);
          }
        });
      } else {
        this.commentService.createComment(formValue).subscribe({
          next: () => {
            this.loadComments(+this.postId);
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

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}