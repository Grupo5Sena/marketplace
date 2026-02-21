import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../auth/services/auth';
import { CartSignal } from '../../cart/services/cart.signals';
import { CategorySignal } from '../../category/services/category-signal';
import { SearchSignal } from '../../search/search.signal';
import { ProductSignal } from '../../products/services/product.signal';
import { UserSummary } from '../../shared/components/user-summary/user-summary';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, UserSummary],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private products = inject(ProductSignal);
  private auth = inject(Auth);
  private cart = inject(CartSignal)
  public categories = inject(CategorySignal);
  public searchSvc = inject(SearchSignal);

  // exposición para template
  items = this.cart.items;
  subtotal = this.cart.subtotal;


  user = this.auth.user;
  isLoggedIn = this.auth.isLoggedIn;

  categoryId = signal<string | null>(null);

  constructor() {
    this.categories.load();

    effect(() => {
      const params: any = {};

      // Filtrar por categoría si existe
      if (this.categoryId()) params.categoryId = this.categoryId();

      this.products.loadList(params);
    });

  } 

  logout() {
    this.auth.logout();
  }
}