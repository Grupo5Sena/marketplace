import { inject, Injectable } from '@angular/core';
import { Api } from '../../core/services/api';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private api = inject(Api)

  getCart() {
    return this.api.get<any>('/cart');
  }

  addToCart(productId: string, quantity: number, priceSnapshot: number) {
    return this.api.post('/cart', {
      productId,
      quantity,
      priceSnapshot,
    });
  }

  updateItem(itemId: string, quantity: number) {
    return this.api.patch(`/cart/${itemId}`, { quantity });
  }

  removeItem(itemId: string) {
    return this.api.delete(`/cart/${itemId}`);
  }

  clearCart() {
    return this.api.delete('/cart');
  }  
}
