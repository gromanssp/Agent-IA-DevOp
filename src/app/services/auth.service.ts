import { Injectable, inject, signal, computed, NgZone, Injector, runInInjectionContext } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { environment } from '../../environments/environment';

export type AuthMethod = 'google' | 'cubepath' | 'email';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  authMethod: AuthMethod;
  cubepathToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private ngZone = inject(NgZone);
  private injector = inject(Injector);

  private readonly _user = signal<UserProfile | null>(null);
  private readonly _ready = signal(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isReady = this._ready.asReadonly();
  readonly profile = computed(() => this._user());

  constructor() {
    // Restaurar sesion Cubepath si existe
    const cubepathSession = sessionStorage.getItem('cubepath-session');
    if (cubepathSession) {
      try {
        this._user.set(JSON.parse(cubepathSession));
      } catch { /* sesion corrupta, ignorar */ }
    }

    // Escuchar cambios de estado de Firebase Auth
    onAuthStateChanged(this.auth, (firebaseUser: User | null) => {
      this.ngZone.run(() => {
        if (firebaseUser) {
          this._user.set(this.mapFirebaseUser(firebaseUser));
        } else if (!sessionStorage.getItem('cubepath-session')) {
          this._user.set(null);
        }
        this._ready.set(true);
      });
    });
  }

  // --- Google Sign-In ---
  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    await runInInjectionContext(this.injector, () =>
      signInWithPopup(this.auth, provider)
    );
  }

  // --- Email/Password Login ---
  async login(email: string, password: string): Promise<void> {
    await runInInjectionContext(this.injector, () =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  // --- Email/Password Register ---
  async register(email: string, password: string, displayName: string): Promise<void> {
    const credential = await runInInjectionContext(this.injector, () =>
      createUserWithEmailAndPassword(this.auth, email, password)
    );
    await runInInjectionContext(this.injector, () =>
      updateProfile(credential.user, { displayName })
    );
    this.ngZone.run(() => {
      this._user.set(this.mapFirebaseUser(credential.user, displayName));
    });
  }

  // --- Cubepath API Token Login ---
  async loginWithCubepath(apiToken: string): Promise<boolean> {
    try {
      const response = await fetch(environment.cubepathApiUrl, {
        headers: { 'Authorization': `Bearer ${apiToken}` }
      });

      if (!response.ok) return false;

      const profile: UserProfile = {
        uid: `cubepath-${crypto.randomUUID()}`,
        email: 'cubepath-user',
        displayName: 'Cubepath User',
        photoURL: null,
        authMethod: 'cubepath',
        cubepathToken: apiToken
      };

      this._user.set(profile);
      // sessionStorage — se borra al cerrar pestana (mas seguro que localStorage)
      sessionStorage.setItem('cubepath-session', JSON.stringify(profile));
      return true;
    } catch {
      return false;
    }
  }

  // --- Logout ---
  async logout(): Promise<void> {
    const method = this._user()?.authMethod;
    if (method === 'google' || method === 'email') {
      await runInInjectionContext(this.injector, () => signOut(this.auth));
    }
    sessionStorage.removeItem('cubepath-session');
    this._user.set(null);
  }

  // --- Helper: token de Cubepath para el interceptor ---
  getCubepathToken(): string | null {
    return this._user()?.cubepathToken ?? null;
  }

  // --- Mapear usuario Firebase a nuestro modelo ---
  private mapFirebaseUser(user: User, overrideDisplayName?: string): UserProfile {
    const provider = user.providerData[0]?.providerId;
    return {
      uid: user.uid,
      email: user.email ?? '',
      displayName: overrideDisplayName ?? user.displayName ?? user.email?.split('@')[0] ?? '',
      photoURL: user.photoURL,
      authMethod: provider === 'google.com' ? 'google' : 'email'
    };
  }
}
