import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [FormsModule, RouterLink]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  async register() {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.register(this.email, this.password, this.fullName);
      this.router.navigate(['/']);
    } catch {
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
