import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      { path: 'chat', loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent) }
    ]
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
