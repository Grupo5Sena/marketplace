import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSignal } from '../../../user/services/user-signal';
import { CategorySignal } from '../../../category/services/category-signal';
import { StoresSignal } from '../../../home/services/stores-signal';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StoresProductSignal } from '../../../home/services/stores-product-signal';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export default class CreateProduct {
  private products = inject(StoresProductSignal);
  private fb = inject(FormBuilder);
  private userSignal = inject(UserSignal);
  public categories = inject(CategorySignal);
  private storesSignal = inject(StoresSignal);
  private route = inject(ActivatedRoute)
  private router = inject(Router);


  // Signals
  categoryList = this.categories.list;
  storeId = this.storesSignal.storeId;
  current = this.products.current; 

  editingId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // Formulario
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    stock: [0, Validators.required],
    tags: [''],
    categoryId: ['', Validators.required],
    image: [''], // input simple → se transforma a images[]
    isFeatured: [false],
  });

  constructor() {
    // Cargar categorías siempre al inicio
    this.categories.load();
    this.editingId = this.route.snapshot.paramMap.get('id');

    // Reactivo: cuando el usuario cambie y tenga storeId, cargar productos
    effect(() => {
      const user = this.userSignal.user();  // señal reactiva
      if (!user) return;

      if (!this.storeId()) {
        this.storesSignal.loadByOwner(user.id);
      }

      if (this.editingId && !this.current()) {
        this.products.loadById(this.editingId);
      }

      const product = this.current();
      if (product && this.editingId) {
        this.fillForm(product);
      }
    });
  }

  fillForm(product: any) {
    this.editingId = product.id;

    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      isFeatured: product.isFeatured,
      tags: product.tags?.join(', '),
      image: product.images?.[0] ?? '',
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

      this.selectedFile = input.files[0];

      // Preview
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    
  }

  // Crear / actualizar producto
  saveProduct() {
    const storeId = this.storeId();
    if (!storeId || this.form.invalid) {
    return;
  }

    const raw = this.form.getRawValue();  
    const dto = {
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      stock: Number(raw.stock),
      categoryId: raw.categoryId,
      isFeatured: raw.isFeatured,
      tags: raw.tags
        ? raw.tags.split(',').map((t) => t.trim())
        : [],
      images: [],
    };

    
    const action = this.editingId
    ? this.products.update(this.editingId, dto, this.selectedFile ?? undefined)
    : this.products.create(storeId, dto, this.selectedFile ?? undefined);

    action.subscribe({
      next: () => {
        alert('Producto guardado correctamente');
        this.router.navigate(['/store/product-list']);
      },
      error: () => alert('Error al guardar producto'),
    });
  }

  cancelEdit() {
    this.router.navigate(['/store/product-list']);
    this.resetForm();
  }

  private resetForm() { 
    this.editingId = null; 
    this.form.reset({ 
      price: 0, 
      stock: 0, 
      isFeatured: false, 
    }); 
  }
}
