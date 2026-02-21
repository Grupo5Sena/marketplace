import { inject, Injectable, signal } from '@angular/core';
import { Api } from '../../core/services/api';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoresSignal {
  private api = inject(Api);

  storeId = signal<string | null>(null);
  loading = signal(false);

  // Cargar tienda del usuario por ownerId
  loadByOwner(ownerId: string) {
    this.loading.set(true);
    this.api.get(`/stores/owner/${ownerId}`)
      .pipe(tap(() => this.loading.set(false)))
      .subscribe({
        next: (store: any) => {
          this.storeId.set(store.id);
        },
        error: () => {
          this.storeId.set(null);
          this.loading.set(false);
        },
      });
  }

  clear() {
    this.storeId.set(null);
  }
}
