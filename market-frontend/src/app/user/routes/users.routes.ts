import { Routes } from "@angular/router"; 

export const userRoutes: Routes = [
    { path: 'profile', loadComponent: () => import('../pages/user-profile/user-profile') },
    { path: 'edit', loadComponent: () => import("../pages/edit-profile/edit-profile") },
    { path: 'list', loadComponent: () => import("../admin/user-list/user-list") },
    { path: 'change-password', loadComponent: () => import("../pages/change-password/change-password") },
]

