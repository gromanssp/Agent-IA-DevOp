import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { ChatSuggestionsService, SIDEBAR_SUGGESTIONS } from '../../services/chat-suggestions.service';
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
  private chatSuggestions = inject(ChatSuggestionsService);

  collapsed = this.sidebarService.collapsed;
  suggestions = SIDEBAR_SUGGESTIONS;

  toggle(): void {
    this.sidebarService.toggle();
  }

  useSuggestion(text: string): void {
    this.chatSuggestions.send(text);
  }
}
