import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreService } from '../../services/store-service';
import { UserSignal } from '../../../user/services/user-signal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-store',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-store.html',
  styleUrl: './create-store.css',
})
export default class CreateStore {
  private fb = inject(NonNullableFormBuilder);
  private storeSvc = inject(StoreService);
  private userSignal = inject(UserSignal);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    logo: [''],
  });

  create() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const dto = {
      ...raw,
      logo: raw.logo || undefined,  // <- aquí convertimos "" a undefined
    };

    this.storeSvc.createStore(this.form.getRawValue()).subscribe({
      next: ({ user }) => {
        this.userSignal.applyProfileUpdate(user);
        this.router.navigateByUrl('/store-dashboard');
      },
      error: (err) => console.error('ERROR', err),
    });
  }
}
