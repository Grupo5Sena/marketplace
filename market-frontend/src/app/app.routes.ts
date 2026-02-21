import { Routes } from '@angular/router';
import { authRoutes } from './auth/routes/auth.routes';
import { featureRoutes } from './components/features_routes/features.routes';

export const routes: Routes = [
    ...authRoutes,
    ...featureRoutes,
    { path: '**', redirectTo: '' },
];
