import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSignal } from '../services/state.signal';
import { UserProfile } from '../../interfaces/user-profile';

export const AuthRoleGuard = (roles: UserProfile['role'][]): CanActivateFn => () => {
  const auth = inject(AuthSignal);
  const router = inject(Router);
  const user = auth.user();

  // Verifica si el usuario está autenticado
  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  //return roles.includes(user.role)? true: router.createUrlTree(['/']);

  // Verifica si el usuario tiene uno de los roles necesarios
  return user.role && roles.includes(user.role) ? true : router.createUrlTree(['/']);
};
