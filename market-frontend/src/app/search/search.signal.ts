import { Injectable, signal, inject } from '@angular/core';
import { tap } from 'rxjs';
import { Search } from './search';


@Injectable({ providedIn: 'root' })
export class SearchSignal {
  private svc = inject(Search);

  results = signal<any[]>([]);
  loading = signal(false);
  total = signal(0);

  search(q: string, categoryId?: number) {
    if (!q && !categoryId) {
      this.clear();
      return;
    }

    const filters = categoryId ? `categoryId = ${categoryId}` : undefined;

    this.loading.set(true);

    this.svc.searchProducts({ q, filters })
      .pipe(tap(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.results.set(res.hits);
          this.total.set(res.estimatedTotalHits);
        },
        error: () => this.loading.set(false),
      });
  }

  clear() {
    this.results.set([]);
    this.total.set(0);
  }
}