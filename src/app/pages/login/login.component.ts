import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  cubepathToken = '';
  errorMessage = '';
  loading = signal(false);
  activeTab = signal<'email' | 'cubepath'>('email');

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }
    this.loading.set(true);
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch {
      this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo.';
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.loading.set(true);
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch {
      this.errorMessage = 'Error al iniciar sesion con Google.';
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithCubepath(): Promise<void> {
    if (!this.cubepathToken.trim()) {
      this.errorMessage = 'Introduce tu API Token de Cubepath.';
      return;
    }
    this.loading.set(true);
    this.errorMessage = '';
    try {
      const success = await this.authService.loginWithCubepath(this.cubepathToken.trim());
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Token invalido. Verifica tu API Token en my.cubepath.com.';
      }
    } catch {
      this.errorMessage = 'Error al verificar el token.';
    } finally {
      this.loading.set(false);
    }
  }

  setTab(tab: 'email' | 'cubepath'): void {
    this.activeTab.set(tab);
    this.errorMessage = '';
  }
}
