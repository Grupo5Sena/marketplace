import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserSignal } from '../../services/user-signal';
import { TitleSignal } from '../../services/title-signal';
import { ImageUrlPipe } from '../../../shared/pipes/image-url-pipe';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RouterLink, ImageUrlPipe],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export default class UserProfile {
  private userSignal = inject(UserSignal);
  private title = inject(TitleSignal);

  user = this.userSignal.user;
  loading = this.userSignal.loading;

  isAdmin = this.userSignal.isAdmin;
  isSeller = this.userSignal.isSeller;  
  
  constructor() {
    this.title.set('Perfil de Usuario');
  }
}
