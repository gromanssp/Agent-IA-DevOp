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
  // SECURITY: cubepathToken is intentionally NOT stored in sessionStorage.
  // It lives only in this in-memory signal. If the page is refreshed, the
  // cubepath user must re-enter their token. This prevents XSS attacks from
  // reading the API key via sessionStorage.getItem().
  cubepathToken?: string;
}

/** Profile shape persisted in sessionStorage — never includes the API token. */
interface PersistedProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  authMethod: AuthMethod;
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
    // SECURITY: Only restore non-cubepath sessions from sessionStorage.
    // Cubepath sessions require re-authentication on page refresh because
    // the API token is never written to sessionStorage.
    const raw = sessionStorage.getItem('cubepath-session');
    if (raw) {
      try {
        const persisted: PersistedProfile = JSON.parse(raw);
        // Only restore if it's NOT a cubepath session — those need the token
        // which is never persisted. A stored cubepath entry is a stale artifact
        // from a previous version; clean it up.
        if (persisted.authMethod !== 'cubepath') {
          this._user.set({ ...persisted });
        } else {
          sessionStorage.removeItem('cubepath-session');
        }
      } catch {
        sessionStorage.removeItem('cubepath-session');
      }
    }

    // Firebase Auth handles its own session persistence (IndexedDB).
    // onAuthStateChanged fires on every reload for Google/email users.
    onAuthStateChanged(this.auth, (firebaseUser: User | null) => {
      this.ngZone.run(() => {
        if (firebaseUser) {
          this._user.set(this.mapFirebaseUser(firebaseUser));
        } else if (!sessionStorage.getItem('cubepath-session')) {
          // Only clear if not an active cubepath in-memory session
          if (this._user()?.authMethod !== 'cubepath') {
            this._user.set(null);
          }
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

      // SECURITY: cubepathToken is stored ONLY in the in-memory signal.
      // sessionStorage only receives a token-free profile for UI display.
      // Rationale: sessionStorage is readable by any JS running on the page
      // (XSS). The token must never leave the JS heap via persistent storage.
      const profile: UserProfile = {
        uid: `cubepath-${crypto.randomUUID()}`,
        email: 'cubepath-user',
        displayName: 'Cubepath User',
        photoURL: null,
        authMethod: 'cubepath',
        cubepathToken: apiToken   // lives in-memory only — NOT serialised below
      };

      this._user.set(profile);

      // Persist only the token-free metadata so the UI can show the user name
      // after a soft navigation, but NOT after a full page reload (by design).
      const persisted: PersistedProfile = {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        authMethod: profile.authMethod,
      };
      sessionStorage.setItem('cubepath-session', JSON.stringify(persisted));

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
    // SECURITY: remove all session artifacts and wipe the in-memory signal
    // so the token is no longer reachable anywhere.
    sessionStorage.removeItem('cubepath-session');
    this._user.set(null);
  }

  // --- Helper: token de Cubepath para el interceptor ---
  // Returns the token from the in-memory signal only.
  // Returns null for non-cubepath users and after page reload.
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
