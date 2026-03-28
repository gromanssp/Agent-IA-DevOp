import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { WebhookModeService } from '../../services/webhook-mode.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  private router = inject(Router);
  webhookMode = inject(WebhookModeService);
  showUserMenu = signal(false);

  user = this.authService.user;

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  toggleUserMenu(): void {
    this.showUserMenu.set(!this.showUserMenu());
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
