import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BadgeVariant } from '../../../models';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge badge-' + variant() + ' badge-' + size()"><ng-content></ng-content></span>`,
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  variant = input<BadgeVariant>(BadgeVariant.PRIMARY);
  size = input<'sm' | 'md' | 'lg'>('md');
}
