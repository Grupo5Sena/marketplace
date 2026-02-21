import { Injectable, signal, inject } from '@angular/core';
import { tap } from 'rxjs';
import { Category } from '../../interfaces/category';
import CategoryService from './category-service';

@Injectable({ providedIn: 'root' })
export class CategorySignal {
  private svc = inject(CategoryService);

  list = signal<Category[]>([]);
  loading = signal(false);

  load() {
    if (this.list().length > 0) return; // evita recarga
    this.loading.set(true);
    this.svc.list()
      .pipe(tap(() => this.loading.set(false)))
      .subscribe({
        next: (cats) => this.list.set(cats),
        error: () => this.loading.set(false),
      });
  }
}
