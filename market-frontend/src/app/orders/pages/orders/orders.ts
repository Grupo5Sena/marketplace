import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersSignal } from '../../services/orders-signal';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export default class Orders {
  public ordersSignal = inject(OrdersSignal);

  constructor() {
    this.ordersSignal.loadUserOrders();
  }  
}
