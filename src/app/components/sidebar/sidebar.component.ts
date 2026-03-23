import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  imports: [RouterLink, RouterLinkActive, AsyncPipe]
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);
  collapsed$ = this.sidebarService.collapsed$;

  toggle(): void {
    this.sidebarService.toggle();
  }
}
