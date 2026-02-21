import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../auth/services/auth';
import { ImageUrlPipe } from '../../pipes/image-url-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-summary',
  imports: [ImageUrlPipe, RouterLink],
  templateUrl: './user-summary.html',
  styleUrl: './user-summary.css',
})
export class UserSummary {
  private auth = inject(Auth)

  user = this.auth.user;
  isLoggedIn = this.auth.isLoggedIn;

  menuOpen = signal(false);

  logout() {
    this.auth.logout();
  }  
}
