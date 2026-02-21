import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Token {
  private readonly storageKey = 'accessToken';
  

  setAccessToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
