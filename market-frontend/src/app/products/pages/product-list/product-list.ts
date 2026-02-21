import { Component, inject } from '@angular/core';
import { ProductSignal } from '../../services/product.signal';
import { CartSignal } from '../../../cart/services/cart.signals';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageUrlPipe } from '../../../shared/pipes/image-url-pipe';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export default class ProductList {
  public products = inject(ProductSignal);
  private cart = inject(CartSignal);

  list = this.products.list;
  loading = this.products.loading;

  constructor() {
    this.products.loadList();
  }

  addToCart(product: any) {
    this.cart.add(product, 1);
  }
}

