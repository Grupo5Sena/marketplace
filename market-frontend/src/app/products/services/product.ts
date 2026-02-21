import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Observable } from 'rxjs';
import { Products } from '../../interfaces/product-model';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private api = inject(Api);

  list(params?: { categoryId?: string }): Observable<Products[]> {
    const q = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.api.get<Products[]>(`/products${q}`);
  }
  
  getById(id: string): Observable<Products> {
    return this.api.get<Products>(`/products/${id}`);
  }

  getBySlug(slug: string): Observable<Products> {
    return this.api.get<Products>(`/products/slug/${slug}`);
  }
}
