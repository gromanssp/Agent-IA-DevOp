import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private sidebarService = inject(SidebarService);
  collapsed = this.sidebarService.collapsed;
}
