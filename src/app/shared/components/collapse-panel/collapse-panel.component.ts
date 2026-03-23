import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-collapse-panel',
  template: `
    <div class="collapse-panel glass-panel">
      <button class="collapse-header" (click)="expanded = !expanded">
        <span>{{ title }}</span>
        <span>{{ expanded ? '-' : '+' }}</span>
      </button>
      @if (expanded) {
        <div class="collapse-body"><ng-content></ng-content></div>
      }
    </div>
  `,
  styleUrl: './collapse-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollapsePanelComponent {
  @Input() title = '';
  @Input() expanded = false;
}
