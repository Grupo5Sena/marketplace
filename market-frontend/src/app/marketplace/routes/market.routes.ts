import { Routes } from '@angular/router';

export const marketRoutes: Routes = [
    { path: '', loadComponent: () => import('../../layout/marketplace-layout/marketplace-layout'),
        children: [
            { path: '', loadComponent: () => import('../pages/marketplace/marketplace') },
            { path: 'products/:id', loadComponent: () => import('../../products/pages/product-detail/product-detail') },
        ],
     },
];
