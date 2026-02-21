import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { InventorySignal } from '../../services/inventory-signals';
import { StoresSignal } from '../../services/stores-signal';
import { Products } from '../../../interfaces/product-model';
import { CommonModule } from '@angular/common';
import { ImageUrlPipe } from '../../../shared/pipes/image-url-pipe';
import { UserSignal } from '../../../user/services/user-signal';

@Component({
  selector: 'app-inventory-store',
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './inventory-store.html',
  styleUrl: './inventory-store.css',
})
export default class InventoryStore {
  public inventorySignal = inject(InventorySignal);
  private storesSignal = inject(StoresSignal);
  private userSignal = inject(UserSignal);


  // Señales locales para inputs de stock
  stockInputs = signal<Record<string, number>>({});
  highlightedProductId = signal<string | null>(null);

  constructor() {
  // Sincroniza inventario cuando exista storeId
    effect(() => {
      const user = this.userSignal.user();
      if (!user) return;

      // Si no hay storeId, cargar la tienda
      const storeId = this.storesSignal.storeId();
      if (!storeId) {
        this.storesSignal.loadByOwner(user.id);
        return;
      }

      // ⬇️ Aquí TypeScript ya sabe que es string
      this.inventorySignal.loadInventory(storeId);
    });

    // Tu efecto existente
    effect(() => {
      const products = this.inventorySignal.inventory();
      if (!products.length) return;

      this.stockInputs.set(
        products.reduce((acc, product) => {
          acc[product.id] = product.stock ?? 0;
          return acc;
        }, {} as Record<string, number>)
      );
    });
  }


  // Función para actualizar stock desde el input
  updateStock(product: Products) {
  const value = this.stockInputs()[product.id];
  if (value === undefined) return;

  this.inventorySignal.updateStock(product.id, value);
}

  updateStockInput(productId: string, value: number) {
    this.stockInputs.update(current => ({
      ...current,
      [productId]: value,
    }));
  }  
}

