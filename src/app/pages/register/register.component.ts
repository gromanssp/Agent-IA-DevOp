import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [FormsModule, RouterLink, NgOptimizedImage]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  logoUrl = '../../../../aia.png';

  fullName = '';
  email = '';
  password = '';
  errorMessage = '';
  loading = signal(false);

  async register(): Promise<void> {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'La contrasena debe tener al menos 6 caracteres.';
      return;
    }
    this.loading.set(true);
    this.errorMessage = '';
    try {
      await this.authService.register(this.email, this.password, this.fullName);
      this.router.navigate(['/']);
    } catch {
      this.errorMessage = 'Error al crear la cuenta. Intenta de nuevo.';
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
}
