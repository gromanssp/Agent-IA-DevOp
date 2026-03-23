import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private sidebarService = inject(SidebarService);

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
}
