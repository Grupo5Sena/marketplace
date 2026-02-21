import { inject, Injectable, signal } from '@angular/core';
import { InventoryServices } from './inventory-services';
import { Products } from '../../interfaces/product-model';


@Injectable({ providedIn: 'root' })
export class InventorySignal {
  private service = inject(InventoryServices);

  inventory = signal<Products[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  loadInventory(storeId: string) {
    this.loading.set(true);
    this.error.set(null);

    this.service.getInventory(storeId).subscribe({
      next: (products) => {
        this.inventory.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cargando inventario');
        this.loading.set(false);
      }
    });
  }

  updateStock(productId: string, quantity: number) {
    this.loading.set(true);
    this.service.updateStock(productId, quantity).subscribe({
      next: (updatedProduct) => {
        const current = this.inventory();
        const index = current.findIndex(p => p.id === updatedProduct.id);
        if (index >= 0) {
          current[index] = updatedProduct;
          this.inventory.set([...current]); // disparar reactividad
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error actualizando stock');
        this.loading.set(false);
      }
    });
  }

  clear() {
    this.inventory.set([]);
    this.loading.set(false);
    this.error.set(null);
  }
}
