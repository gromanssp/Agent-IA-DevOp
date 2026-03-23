import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  @Input() title = 'Statistic';
  @Input() value: string | number = '0';
  @Input() icon = '';
  @Input() trend = 0;
  @Input() accent: 'primary' | 'secondary' | 'success' | 'warning' = 'primary';
}
