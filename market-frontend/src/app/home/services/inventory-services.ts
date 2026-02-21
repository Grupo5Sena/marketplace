import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { Observable } from 'rxjs';
import { Products } from '../../interfaces/product-model';

@Injectable({
  providedIn: 'root',
})
export class InventoryServices {
  private api = inject(Api);

  // Obtener todos los productos en inventario
  getInventory(storeId: string): Observable<Products[]> {
    return this.api.get<Products[]>(`/products/store/${storeId}`);
  }

  // Actualizar stock
  updateStock(productId: string, quantity: number) {
    return this.api.patch<Products>(`/products/${productId}`, { quantity });
  }
  
}
