import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem } from '../../interfaces/cart-model';
import CreateStore from '../../home/pages/create-store/create-store';
import { Cart } from './cart';
import { Auth } from '../../auth/services/auth';

const STORAGE_KEY = 'mvp_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartSignal {
  private _items = signal<CartItem[]>(this.readLocal());
  items = this._items.asReadonly();

  subtotal = computed(() =>
    this._items().reduce((s, i) => s + i.product.price * i.quantity, 0)
  );


  private cartService = inject(Cart);
  private auth = inject(Auth)


  /* ========== LOAD ========== */

  load() {
    if (!this.auth.isLoggedIn()) return;

    this.cartService.getCart().subscribe(cart => {
      this._items.set(cart.items);
    });
  }

  /* ========== ADD ========== */

  add(product: any, qty = 1) {
    if (!this.auth.isLoggedIn()) {
      this.addLocal(product, qty);
      return;
    }

    this.cartService
      .addToCart(product.id, qty, product.price)
      .subscribe(() => this.load());
  }

  /* ========== UPDATE ========== */

  update(item: CartItem, qty: number) {
  if (qty <= 0) {
    this.remove(item);
    return;
  }

  if (!this.auth.isLoggedIn() || !item.id) {
    this.updateLocal(item.product.id, qty);
    return;
  }

  this.cartService
    .updateItem(item.id, qty)
    .subscribe(() => this.load());
  }

  remove(item: CartItem) {
    if (!this.auth.isLoggedIn() || !item.id) {
      this.removeLocal(item.product.id);
      return;
    }

    this.cartService
      .removeItem(item.id)
      .subscribe(() => this.load());
  }
  /* ========== CLEAR ========== */

  clear() {
    if (!this.auth.isLoggedIn()) {
      this.clearLocal();
      return;
    }

    this.cartService.clearCart().subscribe(() => {
      this._items.set([]);
    });
  }

  /* ========== LOCAL ========== */

  private addLocal(product: any, qty: number) {
    const items = [...this._items()];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) items[idx].quantity += qty;
    else items.push({ product, quantity: qty });
    this.setLocal(items);
  }

  private updateLocal(productId: string, qty: number) {
    const items = this._items()
      .map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
      .filter(i => i.quantity > 0);
    this.setLocal(items);
  }

  private removeLocal(productId: string) {
    this.setLocal(this._items().filter(i => i.product.id !== productId));
  }

  private clearLocal() {
    this.setLocal([]);
  }

  private setLocal(items: CartItem[]) {
    this._items.set(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private readLocal(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
}