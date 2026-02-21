import { computed, Injectable, signal } from "@angular/core";
import { UserProfile } from "../../interfaces/user-profile";

@Injectable({ providedIn: 'root' })
export class AuthSignal {
  private _user = signal<UserProfile | null>(null);
  private _isAuthenticated = computed(() => !!this._user());
  
  // read-only access
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated;

  setUser(user: UserProfile | null) {
    this._user.set(user);
  }

  clear() {
    this._user.set(null);
  }
}