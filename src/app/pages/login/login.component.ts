import { Component, inject } from '@angular/core';
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
  errorMessage = '';
  loading = false;

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch {
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch {
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
