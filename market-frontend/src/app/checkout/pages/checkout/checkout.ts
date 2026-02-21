import { Component, inject } from '@angular/core';
import { CartSignal } from '../../../cart/services/cart.signals';
import { Router } from '@angular/router';
import { Api } from '../../../core/services/api';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export default class Checkout {
  public cart = inject(CartSignal);
  private api = inject(Api);
  private router = inject(Router);

  cartSnapshot = this.cart.items;
  subtotal = this.cart.subtotal;

  placeOrder() {
    const payload = {
      items: this.cart.items().map(i => ({ productId: i.product.id, quantity: i.quantity })),
      total: this.cart.subtotal(),
      // agrega shipping, customer, etc. según backend
    };

    // Llamada al backend para crear la orden + sesión de Stripe
    this.api.post<{ checkoutUrl?: string; orderId?: string }>('/checkout/create-session', payload)
      .subscribe({
        next: (res) => {
          if (res.checkoutUrl) {
            // redirige a Stripe Checkout
            window.location.href = res.checkoutUrl;
          } else if (res.orderId) {
            // fallback, navegar a detalle de orden
            this.cart.clear();
            this.router.navigateByUrl(`/orders/${res.orderId}`);
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error al iniciar pago');
        }
      });
  }
}
