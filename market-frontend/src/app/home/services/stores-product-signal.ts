import { inject, Injectable, signal } from '@angular/core';
import { Products } from '../../interfaces/product-model';
import { of, switchMap, tap } from 'rxjs';
import { UploadService } from './upload-service';
import { StoresProductService } from './stores-product-service';

@Injectable({ providedIn: 'root' })
export class StoresProductSignal {
  private svc = inject(StoresProductService);
  private uploader = inject(UploadService);

  // Signals
  list = signal<Products[]>([]);
  loading = signal(false);
  current = signal<Products | null>(null);

    loadByStore(storeId: string) {
        this.list.set([]);
        this.loading.set(true);
        this.svc.listByStore(storeId)
        .pipe(tap(() => this.loading.set(false)))
        .subscribe({
            next: (p) => this.list.set(p),
            error: () => this.loading.set(false),
        });
    }

    loadList(storeId: string) {
        this.loading.set(true);
        this.svc.listByStore(storeId)
        .pipe(tap(() => this.loading.set(false)))
        .subscribe({
            next: (p) => this.list.set(p),
            error: () => this.loading.set(false),
        });
    }

    loadById(id: string) {
        this.loading.set(true);
        this.svc.getById(id)
        .pipe(tap(() => this.loading.set(false)))
        .subscribe({
            next: (p) => this.current.set(p),
            error: () => this.loading.set(false),
        });
    }

    create(storeId: string, dto: any, file?: File) {
    this.loading.set(true);
    const upload$ = file ? this.uploader.uploadFile(file) : of({ url: dto.images?.[0] ?? '' });

    return upload$.pipe(
      switchMap((res) => {
        const finalDto = { ...dto, images: res.url ? [res.url] : [] };
        return this.svc.create(storeId, finalDto);
      }),
      tap({
        next: (p) => {
          this.list.set([...this.list(), p]);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      })
    );
  }

  update(id: string, dto: any, file?: File) {
    this.loading.set(true);
    const upload$ = file ? this.uploader.uploadFile(file) : of({ url: dto.images?.[0] ?? '' });

    return upload$.pipe(
      switchMap((res) => {
        const finalDto = { ...dto, images: res.url ? [res.url] : [] };
        return this.svc.update(id, finalDto);
      }),
      tap({
        next: (p) => {
          const updatedList = this.list().map((pr) => (pr.id === id ? p : pr));
          this.list.set(updatedList);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      })
    );
  }

  delete(id: string) {
    this.loading.set(true);
    return this.svc.delete(id).pipe(
      tap({
        next: () => {
          this.list.set(this.list().filter((p) => p.id !== id));
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      })
    );
  }

  clearCurrent() { this.current.set(null); }

  clear() {
    this.list.set([]);
    this.current.set(null);
    this.loading.set(false);
  }
}
