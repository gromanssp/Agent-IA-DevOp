import { Component, input, ChangeDetectionStrategy } from '@angular/core';

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
  accent = input<'primary' | 'secondary' | 'success' | 'warning'>('primary');
}
