import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { User } from '../../services/user';
import { TitleSignal } from '../../services/title-signal';
import { UserProfile } from '../../../interfaces/user-profile';


@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {
  usersSvc = inject(User);
  title = inject(TitleSignal);

  users = signal<UserProfile[]>([]);
  loading = signal(false);

  constructor() {
    this.title.set('Gestión de Usuarios');
    this.load();
  }

  load() {
    this.loading.set(true);

    this.usersSvc.listUsers().subscribe({
      next: (items) => {
        this.users.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
