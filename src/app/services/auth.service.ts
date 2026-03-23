import { Injectable, signal, computed } from '@angular/core';

export interface UserProfile { uid: string; email: string; displayName: string; role: string; createdAt: Date; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<UserProfile | null>(null);
  user = this._user.asReadonly();
  isAuthenticated = computed(() => this._user() !== null);
  profile = computed(() => this._user());

  constructor() {
    const stored = localStorage.getItem('groman-user');
    if (stored) { try { this._user.set(JSON.parse(stored)); } catch {} }
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    const profile: UserProfile = { uid: crypto.randomUUID(), email, displayName, role: 'user', createdAt: new Date() };
    this._user.set(profile);
    localStorage.setItem('groman-user', JSON.stringify(profile));
  }

  async login(email: string, password: string): Promise<void> {
    const stored = localStorage.getItem('groman-user');
    if (stored) { this._user.set(JSON.parse(stored)); return; }
    const profile: UserProfile = { uid: crypto.randomUUID(), email, displayName: email.split('@')[0], role: 'user', createdAt: new Date() };
    this._user.set(profile);
    localStorage.setItem('groman-user', JSON.stringify(profile));
  }

  async loginWithGoogle(): Promise<void> { await this.login('user@gmail.com', ''); }
  logout(): void { this._user.set(null); localStorage.removeItem('groman-user'); }
}