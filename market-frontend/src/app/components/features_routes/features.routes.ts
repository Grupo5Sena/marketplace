import { Routes } from '@angular/router';
import { userRoutes } from '../../user/routes/users.routes';
import { marketRoutes } from '../../marketplace/routes/market.routes';
import { storeRoutes } from '../../layout/routes/store-layout.routes';

export const featureRoutes: Routes = [
  ...marketRoutes,
  { path: 'cart', loadComponent: () => import('../../cart/pages/cart/cart') },
  { path: 'checkout', loadComponent: () => import('../../checkout/pages/checkout/checkout') },
  { path: 'orders', loadComponent: () => import('../../orders/pages/orders/orders') },
  { path: 'create-store', loadComponent: () => import('../../home/pages/create-store/create-store') },
  {
    path: 'store',
    children: storeRoutes
  }, 
  {
    path: 'user',
    children: userRoutes
  }
];