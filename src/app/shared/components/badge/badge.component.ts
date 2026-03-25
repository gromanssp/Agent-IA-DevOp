import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge badge-' + variant() + ' badge-' + size()"><ng-content></ng-content></span>`,
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  variant = input<'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'outline'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
}
