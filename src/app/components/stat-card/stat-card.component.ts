import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BadgeVariant } from '../../models';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  title = input('Statistic');
  value = input<string | number>('0');
  icon = input('');
  trend = input(0);
  accent = input<BadgeVariant>(BadgeVariant.PRIMARY);
}
