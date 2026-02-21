import { Component, effect, inject } from '@angular/core';
import { StoresSignal } from '../../../home/services/stores-signal';
import { UserSignal } from '../../../user/services/user-signal';
import { CommonModule } from '@angular/common';
import { ImageUrlPipe } from '../../../shared/pipes/image-url-pipe';
import { Router } from '@angular/router';
import { StoresProductSignal } from '../../../home/services/stores-product-signal';

@Component({
  selector: 'app-store-product-list',
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './store-product-list.html',
  styleUrl: './store-product-list.css',
})
export default class StoreProductList {  
  private products = inject(StoresProductSignal);
  private userSignal = inject(UserSignal);
  private storesSignal = inject(StoresSignal)
  private router = inject(Router);

  // Signals
  loading = this.products.loading;
  productList = this.products.list;
  storeId = this.storesSignal.storeId; 


  constructor() {
    // Reactivo: cuando el usuario cambie y tenga storeId, cargar productos
    effect(() => {
      const user = this.userSignal.user();  // señal reactiva
      if (!user) return;

      if (!this.storeId()) {
        this.storesSignal.loadByOwner(user.id);
      }

      // Cargar productos solo cuando el storeId ya esté
      const storeId = this.storeId();
      if (storeId) {
        this.products.loadByStore(storeId);
      }
    });
  }

  editProduct(productId: string) {
    this.router.navigate(['/store/create-product', productId]);
  }

  deleteProduct(productId: string) {
    const storeId = this.storeId();
    if(!storeId) return;

    if (!confirm('¿Deseas eliminar este producto?')) return;

    this.products.delete(productId).subscribe({
      next: () => {
        alert('Producto eliminado correctamente');
        this.products.loadByStore(storeId);
      },
      error: () => alert('Error al eliminar producto'),
    });
  }
}
