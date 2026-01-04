import { Routes } from '@angular/router';

/**
 * Feed Module Routes
 * 
 * Following modular monolith approach, each feature has its own routing
 */
export const FEED_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./post-feed/post-feed').then(m => m.PostFeed),
    title: 'Community Feed | Marketing Insights',
    data: {
      description: 'Discover the latest marketing insights and success stories from our community'
    }
  },
  {
    path: 'post/:id',
    loadComponent: () => 
      import('./post/post').then(m => m.Post),
    title: 'Post Details | Marketing Insights'
  },
  {
    path: 'comments',
    loadComponent:()=>
      import('./comment-component/comment-component').then(m=>m.CommentComponent),
  }
];
