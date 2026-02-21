import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Auth } from '../../services/auth';
import { AuthSignal } from '../../../core/services/state.signal';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export default class Login {
  // inyectar dependencias
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private authSignal = inject(AuthSignal);
  private router = inject(Router);

  // Formulario tipado y no-nullable
  form = this.fb.group({
    email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    remember: this.fb.control<boolean>(false, { nonNullable: true}),
  });

  // Estados reactivos con signals
  loading = signal(false);
  error = signal<string | null>(null);
  // UI helpers
  passwordVisible = signal(false);

  // Submit del formulario
  async submit() {
    // Evitar envío si inválido y marcar para mostrar errores
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    // Bloquear el formulario para evitar doble envío
    this.form.disable();

    const { email, password, remember } = this.form.getRawValue();

    try {

      // login solo devuelve token
      await firstValueFrom(this.authService.login(email, password));

      // fetch profile devuelve user y lo setea en AuthSignal
      await firstValueFrom(this.authService.fetchProfile());

      // Navegar al inicio / dashboard
      await this.router.navigate(['/']);
    } catch (err: any) {
      // Mapear diferentes formatos de error
      const msg = err?.error?.message || err?.message || 'Credenciales inválidas';
      this.error.set(String(msg));
    } finally {
      this.loading.set(false);
      // Volver a habilitar el formulario
      try { this.form.enable(); } catch {}
    }
  }

  // Obtener mensaje de error por campo
  fieldErrors(controlName: 'email' | 'password') {
    const c = this.form.get(controlName);
    if (!c || !c.touched || !c.errors) return [];
    const e = c.errors;
    const out: string[] = [];
    if (e['required']) out.push('Campo requerido');
    if (e['email']) out.push('Formato de email inválido');
    if (e['minlength']) out.push(`Mínimo ${e['minlength'].requiredLength} caracteres`);
    return out;
  } 
}
