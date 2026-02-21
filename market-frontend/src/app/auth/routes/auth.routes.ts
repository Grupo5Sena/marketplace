import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: 'login', loadComponent: () => import('../pages/login/login') },
  { path: 'register', loadComponent: () => import('../pages/register/register') },
];
