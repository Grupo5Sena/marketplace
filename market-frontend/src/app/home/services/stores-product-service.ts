import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Observable } from 'rxjs';
import { Products } from '../../interfaces/product-model';

@Injectable({
  providedIn: 'root',
})
export class StoresProductService {
  private api = inject(Api);

  listByStore(storeId: string): Observable<Products[]> {
    return this.api.get<Products[]>(`/products/store/${storeId}`);
  }

  getById(id: string): Observable<Products> {
    return this.api.get<Products>(`/products/${id}`);
  }

  create(storeId: string, dto: any): Observable<Products> {
    return this.api.post<Products>(`/products/${storeId}`, dto);
  }

  update(id: string, dto: any): Observable<Products> {
    return this.api.patch<Products>(`/products/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.api.delete<any>(`/products/${id}`);
  }  
}
