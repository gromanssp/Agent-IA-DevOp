import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);
  collapsed = this.sidebarService.collapsed;

  toggle(): void {
    this.sidebarService.toggle();
  }
}
