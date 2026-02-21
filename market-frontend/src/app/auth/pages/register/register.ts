import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthSignal } from '../../../core/services/state.signal';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export default class Register {
  // inyectar dependencias
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private authSignal = inject(AuthSignal);
  private router = inject(Router);

  // Formulario tipado y no-nullable
  form = this.fb.group({
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    acceptTerms: this.fb.control<boolean>(false, { nonNullable: true })
  });

  // Estados reactivos con signals
  loading = signal(false);
  error = signal<string | null>(null);
  passwordVisible = signal(false);
  success = signal<string | null>(null);  

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword, acceptTerms } = this.form.getRawValue();

    // Validar contraseñas
    if (password !== confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (!acceptTerms) {
      this.error.set('Debes aceptar términos y condiciones');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.form.disable();

    try {
      await firstValueFrom(this.authService.register(name, email, password));
      const profile = await firstValueFrom(this.authService.fetchProfile());

      this.authSignal.setUser(profile);
      await this.router.navigate(['/'], {
        state: { success: 'Usuario registrado correctamente' }
      });
    } catch (err: any) {
      const msg = err?.error?.message || err?.message || 'Error al registrar el usuario';
      this.error.set(String(msg));
    } finally {
      this.loading.set(false);
      try { this.form.enable(); } catch {}
    }
  }

  fieldErrors(controlName: 'name' | 'email' | 'password' | 'confirmPassword') {
    const c = this.form.get(controlName);
    if (!c || !c.touched || !c.errors) return[];
    const e = c.errors;
    const out: string[] = [];
    if (e['required']) out.push('Campo requerido');
    if (e['email']) out.push('Formato de emal inválido');
    if (e['minlength']) out.push(`Mínimo ${e['minlength'].requiredLength} caracteres`);
    return out;
  }
}
