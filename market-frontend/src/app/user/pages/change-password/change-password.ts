import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSignal } from '../../services/user-signal';
import { User } from '../../services/user';
import { TitleSignal } from '../../services/title-signal';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export default class ChangePassword {
  fb = inject(NonNullableFormBuilder);
  usersignal = inject(UserSignal)
  userSvc = inject(User);
  title = inject(TitleSignal);
  router = inject(Router);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  constructor() {
    this.title.set('Cambiar Contraseña');
  }

  save() {
    if (this.form.invalid) {
      alert('Por favor corrige los campos inválidos.');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.form.getRawValue();

    if (newPassword !== confirmPassword) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }

    const payload = {
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
      confirmNewPassword: confirmPassword.trim(),
    };

    console.log('Payload enviado al backend:', payload);

    this.userSvc.changePassword(payload).subscribe({
      next: () => {
        alert('Contraseña actualizada correctamente ✅');
        this.router.navigateByUrl('/user/profile');
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Error al cambiar contraseña ❌');
      }
    });
  }
}

