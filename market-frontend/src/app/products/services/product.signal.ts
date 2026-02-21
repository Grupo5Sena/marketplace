import { inject, Injectable, signal } from '@angular/core';
import { Product } from './product';
import { tap } from 'rxjs';
import { Products } from '../../interfaces/product-model';

@Injectable({ providedIn: 'root' })
export class ProductSignal {
  private svc = inject(Product);

  // signals
  list = signal<Products[]>([]);
  loading = signal(false);
  current = signal<Products | null>(null);

  loadList(params?: { categoryId?: string }) {
    this.loading.set(true);
    this.svc.list(params).pipe(tap(() => this.loading.set(false))).subscribe({
        next: (p) => this.list.set(p),
        error: () => this.loading.set(false),
      });
    }

  loadById(id: string) {
    this.loading.set(true);
    this.svc.getById(id).pipe(tap(() => this.loading.set(false))).subscribe({
      next: (p) => this.current.set(p),
      error: () => this.loading.set(false),
    });
  }
  
  loadBySlug(slug: string) {
    this.loading.set(true);
    this.svc.getBySlug(slug).pipe(tap(() => this.loading.set(false))).subscribe({        
      next: (p) => this.current.set(p),
      error: () => this.loading.set(false),
    });
  }

  clearCurrent() {
    this.current.set(null);
  }
}