import { Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { ChatComponent } from './pages/chat/chat.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      { path: 'chat', component: ChatComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }
];
