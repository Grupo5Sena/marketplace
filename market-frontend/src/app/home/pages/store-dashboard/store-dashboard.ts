import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { DashboardSignal } from '../../services/dashboard-signal';
import { SalesChart } from '../../../shared/components/sales-chart/sales-chart';
import { InventorySignal } from '../../services/inventory-signals';
import { Router } from '@angular/router';
import { UserSignal } from '../../../user/services/user-signal';
import { StoresSignal } from '../../services/stores-signal';

@Component({
  selector: 'app-store-dashboard',
  imports: [CommonModule, SalesChart],
  templateUrl: './store-dashboard.html',
  styleUrl: './store-dashboard.css',
})
export default class StoreDashboard {
  readonly dashboard = inject(DashboardSignal);
  private inventorySignal = inject(InventorySignal);
  private userSignal = inject(UserSignal);
  private storesSignal = inject(StoresSignal);
  private router = inject(Router);

  private LOW_STOCK_LIMIT = 5;

  readonly lowStock = computed(() =>
    this.inventorySignal.inventory().filter(p => (p.stock ?? 0) <= this.LOW_STOCK_LIMIT));

  readonly hasLowStock = computed(() => this.lowStock().length > 0);

  readonly highlightedProductId = computed(() => null);

  constructor() {
    // Cargar dashboard cuando exista usuario + store
    effect(() => {
      const user = this.userSignal.user();
      if (!user) return;

      if (!this.storesSignal.storeId()) {
        this.storesSignal.loadByOwner(user.id);
        return;
      }

      this.dashboard.load();
    });

    // Cargar inventario cuando exista storeId
    effect(() => {
      const storeId = this.storesSignal.storeId();
      if (!storeId) return;

      this.inventorySignal.loadInventory(storeId);
    });
  }
  
  goToInventory(productId: string) {
    this.router.navigate(['/store/inventory'], {
      queryParams: { highlight: productId },
    });
  }
}