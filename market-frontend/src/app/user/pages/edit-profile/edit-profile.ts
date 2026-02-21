import { Component, effect, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSignal } from '../../services/user-signal';
import { User } from '../../services/user';
import { TitleSignal } from '../../services/title-signal';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../home/services/upload-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export default class EditProfile {
  private fb = inject(NonNullableFormBuilder);
  private userSignal = inject(UserSignal);
  private userSvc = inject(User);
  private title = inject(TitleSignal);
  private uploadSvc = inject(UploadService);
  private router = inject(Router)
  

  avatarPreview: string | null = null;
  selectedFile: File | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(/^\+?\d{7,15}$/)], // validar número de teléfono internacional
    avatar: [''],
  });

  constructor() {
    this.title.set('Editar Perfil');

    // Cargar valores iniciales
    effect(() => {
      const u = this.userSignal.user();
      if (u) { 
        this.form.patchValue({
          name: u.name,
          email: u.email,
          phone: u.phone || '',
        });
        this.avatarPreview = u.avatar || null;
      }
    });
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

      this.selectedFile = input.files[0];

      // Preview
      const reader = new FileReader();
      reader.onload = () => this.avatarPreview = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
  }

  save() {
  if (this.form.invalid) return alert('Formulario inválido');

  const raw = this.form.getRawValue();

  const payload = {
    name: raw.name.trim(),
    email: raw.email.trim(),
    phone: raw.phone?.trim(),
    avatar: '', // inicializamos vacío
  };

  const action$ = this.selectedFile
    ? this.uploadSvc.uploadAvatar(this.selectedFile).pipe(
        switchMap(res => {
          payload.avatar = res.url; // URL generada
          return this.userSvc.updateProfile(payload);
        })
      )
    : this.userSvc.updateProfile(payload);

  action$.subscribe({
    next: profile => {
      this.userSignal.applyProfileUpdate(profile);
      alert('Perfil actualizado ✅');
      this.router.navigateByUrl('/profile');
    },
    error: err => {
      console.error('Error guardando perfil:', err);
      alert('Error actualizando perfil');
    }
  });
 }
}