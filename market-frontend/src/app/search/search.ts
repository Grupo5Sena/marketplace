import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../core/services/api';

@Injectable({
  providedIn: 'root',
})
export class Search {
  private api = inject(Api);

  searchProducts(params: {
    q: string;
    filters?: string;
  }): Observable<any> {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== '')
        .reduce((a, [k, v]) => ({ ...a, [k]: String(v) }), {})
    ).toString();

    return this.api.get(`/search/products?${query}`);
  }  
}
