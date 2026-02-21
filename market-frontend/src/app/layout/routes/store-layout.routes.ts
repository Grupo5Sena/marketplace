import { Routes } from '@angular/router';

export const storeRoutes: Routes = [
    { 
        path: '', 
        loadComponent: () => 
            import('../sotre-layout/sotre-layout'),
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('../../home/pages/store-dashboard/store-dashboard') },


            // PRODUCTOS
            { path: 'create-product', loadComponent: () => import('../../products/pages/create-product/create-product') },
            { path: 'create-product/:id', loadComponent: () => import('../../products/pages/create-product/create-product') },
            { path: 'product-list', loadComponent: () => import('../../products/pages/store-product-list/store-product-list') },
            { path: 'inventory', loadComponent: () => import('../../home/pages/inventory-store/inventory-store') },

            
            // Ventas
            { path: 'orders', loadComponent: () => import('../../orders/pages/orders/orders') },
            { path: 'payments', loadComponent: () => import('../../payment/pages/payments/payments') },

            
           
        ]
    },    
];
