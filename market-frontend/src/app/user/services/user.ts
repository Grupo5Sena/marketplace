import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../../interfaces/user-profile';
import { Api } from '../../core/services/api';

@Injectable({
  providedIn: 'root'
})
export class User {
  private api = inject(Api)

  getProfile() {
    return this.api.get<UserProfile>('/users/me/profile');        
  }

  updateProfile(data: Partial<UserProfile>) {
    return this.api.patch<UserProfile>('/users/me/profile', data);
  }

  changePassword(data: { currentPassword: string; newPassword: string; confirmNewPassword: string; }) {
    return this.api.patch('/users/me/change-password', data);
  }

  listUsers(): Observable<UserProfile[]> {
    return this.api.get<UserProfile[]>('/users');
  }
}
