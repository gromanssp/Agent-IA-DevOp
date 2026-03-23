import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule, UpperCasePipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile', templateUrl: './profile.component.html', styleUrl: './profile.component.css',
  imports: [CommonModule, FormsModule, UpperCasePipe, SlicePipe], changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private authService = inject(AuthService);
  displayName = ''; email = '';
  currentPassword = ''; newPassword = ''; confirmPassword = '';
  saveStatus: 'idle'|'saved'|'error' = 'idle';
  passwordStatus: 'idle'|'saved'|'mismatch' = 'idle';

  constructor() {
    effect(() => { const p = this.authService.profile(); if (p) { this.displayName = p.displayName; this.email = p.email; } });
  }
  saveProfile(): void { this.saveStatus = 'saved'; setTimeout(() => this.saveStatus = 'idle', 2000); }
  savePassword(): void {
    if (this.newPassword !== this.confirmPassword) { this.passwordStatus = 'mismatch'; setTimeout(() => this.passwordStatus = 'idle', 2000); return; }
    this.passwordStatus = 'saved'; this.currentPassword = ''; this.newPassword = ''; this.confirmPassword = '';
    setTimeout(() => this.passwordStatus = 'idle', 2000);
  }
}