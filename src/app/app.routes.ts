import { Routes } from '@angular/router';

export const routes: Routes = [
     {
        path: 'feed',
        loadChildren: () => import('./features/feed/feed-routes').then(m => m.FEED_ROUTES)
    },
    {
        path: '**',
        redirectTo: '/feed'
    }
];
