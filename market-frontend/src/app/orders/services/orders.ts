import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../core/services/api';
import { Order } from '../../interfaces/order-model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private api = inject(Api);

  placeOrder(payload: any): Observable<Order> {
    return this.api.post<Order>('/orders', payload);
  }

  listUserOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('/orders/my');
  }

  listStoreOrders() {
    return this.api.get<Order[]>('/orders/store');
  }

  getById(id: string) {
    return this.api.get<Order>(`/orders/${id}`);
  }
}