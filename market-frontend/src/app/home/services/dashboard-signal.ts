import { computed, inject, Injectable, signal } from '@angular/core';
import DashboardService from './dashboard-service';

@Injectable({ providedIn: 'root' })
export class DashboardSignal {
  private service = inject(DashboardService);

  // UI state
  readonly range = signal<'day' | 'month'>('month');
  readonly loading = signal(false);
  readonly storeId = signal<string>('');

  // data
  readonly summary = signal<any>(null);
  readonly salesChart = signal<any[]>([]);
  readonly topProducts = signal<any[]>([]);
  readonly recentOrders = signal<any[]>([]);

  
  load() {
    this.loading.set(true);

    this.service
      .getDashboard({ range: this.range(), compare: true })
      .subscribe({
        next: (res: any) => {
          this.summary.set(res.summary);
          this.salesChart.set(res.salesChart);
          this.topProducts.set(res.topProducts);
          this.recentOrders.set(res.recentOrders);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  changeRange(range: 'day' | 'month') {
    this.range.set(range);
    this.load();
  }
  
}
