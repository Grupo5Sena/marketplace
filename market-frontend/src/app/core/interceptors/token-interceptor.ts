import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Token } from '../../auth/services/token';
import { Auth } from '../../auth/services/auth';
import { Router } from '@angular/router';
import { catchError, filter, finalize, ReplaySubject, switchMap, take, throwError } from 'rxjs';

let isRefreshing = false;
const refreshSubject = new ReplaySubject<string | null>(1); 

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const tokenSVC = inject(Token);
  const authSvc = inject(Auth);
  const router = inject(Router)
  
  const access = tokenSVC.getAccessToken();

  // Excluir rutas de autenticación
  const isAuthRequest = isExcludedFromRefresh(req.url);
  
  let authReq = req;
  if (access && !isAuthRequest) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${access}` } });
  }
    
  return next(authReq).pipe(
    catchError(err => {
      // Si no es un 401 o es una ruta de auth, no intentamos refrescar
      if (err.status !== 401 || isAuthRequest) {
        return throwError(() => err);
      }

      // Si ya estamos refrescando, esperamos el nuevo token
        if (!isRefreshing) {
          isRefreshing = true;

          authSvc.refreshAccessToken().pipe(
            take(1),
            finalize(() => (isRefreshing = false))
          ).subscribe({
            next: (newToken: string | null) => {
              if (newToken) {
                tokenSVC.setAccessToken(newToken);
                refreshSubject.next(newToken);
              } else {
                refreshSubject.next(null);
                handleLogout(authSvc, router);
              }
            },
            error: () => {
              refreshSubject.next(null);
              handleLogout(authSvc, router);
            } 
          });          
        }

        return refreshSubject.pipe(
          filter(token => token !== null), 
          take(1),
          switchMap(Token => {
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${Token}` } });
            return next(retryReq);          
          })
       );
     })
  );
};

// Función utilitaria para excluir ciertas rutas del interceptor
function isExcludedFromRefresh(url: string): boolean {
  return url.endsWith('/auth/refresh') || url.endsWith('/auth/login');
}

// Logout y navegación centralizados
function handleLogout(authSvc: Auth, router: Router) {
  authSvc.logout();
  router.navigate(['/auth/login']);
}
