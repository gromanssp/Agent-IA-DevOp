import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-collapse-panel',
  standalone: true,
  template: `
    <div class="collapse-panel glass-panel">
      <button class="collapse-header" (click)="expanded.set(!expanded())">
        <span>{{ title() }}</span>
        <span>{{ expanded() ? '-' : '+' }}</span>
      </button>
      @if (expanded()) {
        <div class="collapse-body"><ng-content></ng-content></div>
      }
    </div>
  `,
  styleUrl: './collapse-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollapsePanelComponent {
  title = input('');
  expanded = signal(false);
}
