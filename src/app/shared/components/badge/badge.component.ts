import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="'badge badge-' + variant + ' badge-' + size"><ng-content></ng-content></span>`,
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
