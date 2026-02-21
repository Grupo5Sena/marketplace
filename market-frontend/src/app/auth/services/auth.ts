import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Token } from './token';
import { AuthSignal } from '../../core/services/state.signal';
import { LoginResponse } from '../../interfaces/login-response';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { UserProfile } from '../../interfaces/user-profile';
import { Router } from '@angular/router';
import { Cart } from '../../cart/services/cart';


@Injectable({ providedIn: 'root'})
export class Auth {
  private api = inject(Api);
  private tokenSVC = inject(Token);
  private authSignal = inject(AuthSignal);
  private router = inject(Router);
  private cartService = inject(Cart)

  login(email: string, password: string) {
    return this.api.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap(res => {
        if (res.accessToken) this.tokenSVC.setAccessToken(res.accessToken);
        this.authSignal.setUser(res.user);
      })
    );
  }
  

  register(name: string, email: string, password: string) {
    return this.api.post('/auth/register', { name, email, password });
  }

  refreshAccessToken(): Observable<string> {
    return this.api.post<{ accessToken: string }>('/refresh', {}).pipe(
      map(res => res.accessToken),
      tap(token => {
        if (token) this.tokenSVC.setAccessToken(token);
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    this.api.post('/logout', {}).subscribe({ error: () => {} });
    this.tokenSVC.clear();
    this.authSignal.clear();

    this.router.navigateByUrl('');
  }

  // Opcional: Obtener el perfil del usuario autenticado
  fetchProfile() {
    return this.api.get<UserProfile>('/users/me/profile').pipe(
      tap(user => this.authSignal.setUser(user)),
      catchError(() => {
        this.authSignal.clear();
        return of(null);
      }),
    );
  }

  // Helper getters para el template
  isLoggedIn = this.authSignal.isAuthenticated;
  
  user = this.authSignal.user;

  private syncCartAfterLogin() {
  const items = JSON.parse(localStorage.getItem('mvp_cart_v1') || '[]');

  items.forEach((item: any) => {
    this.cartService.addToCart(
      item.product.id,
      item.quantity,
      item.product.price
    ).subscribe();
  });

  localStorage.removeItem('mvp_cart_v1');
}

}
