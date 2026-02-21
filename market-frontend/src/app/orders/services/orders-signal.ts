import { computed, inject, Injectable, signal } from "@angular/core";
import { Order } from "../../interfaces/order-model";
import { OrdersService } from "./orders";


@Injectable({ providedIn: 'root' })
export class OrdersSignal {
  private ordersSvc = inject(OrdersService);

  private _orders = signal<Order[]>([]);
  private _loading = signal(false);

  readonly orders = this._orders.asReadonly();
  readonly loading = this._loading.asReadonly();

  // ===== DASHBOARD DERIVED STATE =====

  readonly totalOrders = computed(() => this._orders().length);

  readonly totalRevenue = computed(() =>
    this._orders()
      .filter(o => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.total, 0)
  );

  readonly pendingOrders = computed(() =>
    this._orders().filter(o => o.status === 'PENDING').length
  );

  readonly completedOrders = computed(() =>
    this._orders().filter(o => o.status === 'SHIPPED').length
  );

  readonly recentOrders = computed(() =>
    this._orders().slice(0, 5)
  );

  // ===== LOADERS =====

  loadUserOrders() {
    this._loading.set(true);
    this.ordersSvc.listUserOrders().subscribe({
      next: (list) => {
        this._orders.set(list);
        this._loading.set(false);
      },
      error: () => {
        this._orders.set([]);
        this._loading.set(false);
      },
    });
  }

  loadStoreOrders() {
    this._loading.set(true);

    this.ordersSvc.listStoreOrders().subscribe({
      next: orders => {
        this._orders.set(orders);
        this._loading.set(false);
      },
      error: () => {
        this._orders.set([]);
        this._loading.set(false);
      },
    });
  }
}
