import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private sidebarService = inject(SidebarService);

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
