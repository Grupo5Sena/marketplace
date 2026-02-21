import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductSignal } from '../../services/product.signal';
import { CartSignal } from '../../../cart/services/cart.signals';
import { ImageUrlPipe } from '../../../shared/pipes/image-url-pipe';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export default class ProductDetail {
  public products = inject(ProductSignal);
  private route = inject(ActivatedRoute);
  private cart = inject(CartSignal);

  current = this.products.current;
  loading = this.products.loading;
  

  constructor() {
    const id = this.route.snapshot.params['id'] || this.route.snapshot.paramMap.get('id');
    if (id) this.products.loadById(id);
  }

  addToCart() {
    const p = this.current();
    if (p) this.cart.add(p, 1);
  }  
}
