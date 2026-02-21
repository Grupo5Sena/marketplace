import { Component, inject, OnInit } from '@angular/core';
import { CartSignal } from '../../services/cart.signals';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageUrlPipe } from '../../../shared/pipes/image-url-pipe';
import { CartItem } from '../../../interfaces/cart-model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export default class Cart implements OnInit {
  cart = inject(CartSignal);
  router = inject(Router);

  ngOnInit() {
    // 🔥 carga backend si está logueado
    this.cart.load();
  }

  increase(item: CartItem) {
  this.cart.update(item, item.quantity + 1);
  }

  decrease(item: CartItem) {
    this.cart.update(item, item.quantity - 1);
  }

  remove(item: CartItem) {
    this.cart.remove(item);
  }
  clear() {
    this.cart.clear();
  }

  checkout() {
    this.router.navigateByUrl('/checkout');
  }
}
