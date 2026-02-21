import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UserProfile } from '../../interfaces/user-profile';
import { User } from './user';
import { AuthSignal } from '../../core/services/state.signal';
import { catchError, of, tap } from 'rxjs';
import { DashboardSignal } from '../../home/services/dashboard-signal';
import { StoresSignal } from '../../home/services/stores-signal';
import { CategorySignal } from '../../category/services/category-signal';
import { StoresProductSignal } from '../../home/services/stores-product-signal';

@Injectable({
  providedIn: 'root'
})
export class UserSignal {
  private usersApi = inject(User);
  private auth = inject(AuthSignal);
  private productSignal = inject(StoresProductSignal);
  private storesSignal = inject(StoresSignal);

  private _user = signal<UserProfile | null>(null);
  private _loading = signal(false);
  private _saving = signal(false);

  user = this._user.asReadonly();
  loading = this._loading.asReadonly();
  saving = this._saving.asReadonly();

  isAdmin = computed(() => this._user()?.role === 'ADMIN');
  isSeller = computed(() => this._user()?.role === 'SELLER');

  displayName = computed(
    () => this._user()?.name ?? this._user()?.email ?? 'Usuario'
  );

  constructor() {
    effect(() => {
      const authUser = this.auth.user();

      if (!authUser) {
        this._user.set(null);

        this.productSignal.clear();
        this.storesSignal.clear();
        return;
      }

      // Datos básicos desde el token
      this._user.set({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
      });

      // Sincronizar con backend
      this.loadProfile();
    });
  }

  // CARGA DE PERFIL (HTTP OK)
  loadProfile() {
    this._loading.set(true);

    this.usersApi.getProfile().pipe(
      tap(profile => {
        if (profile) this._user.set(profile);
      }),
      catchError(() => of(null)),
      tap(() => this._loading.set(false))
    ).subscribe();
  }

  // ACTUALIZACIÓN LOCAL DE PERFIL
  applyProfileUpdate(updated: Partial<UserProfile>) {
    this._user.update(current =>
      current ? { ...current, ...updated } : { ...updated } as UserProfile
    );
  }

  // USADO SOLO SI QUIERES SETEAR
  setUser(user: UserProfile | null) {
    this._user.set(user);
  }
}
