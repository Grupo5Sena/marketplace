import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import ProductList from '../../../products/pages/product-list/product-list';

@Component({
  selector: 'app-marketplace',
  imports: [CommonModule, ProductList],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css',
})
export default class Marketplace {
  
}
