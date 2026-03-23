import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="progress-track" [style.height.px]="height">
      <div class="progress-fill" [class]="'fill-' + variant"
        [class.striped]="striped" [class.animated]="animated"
        [style.width.%]="value">
      </div>
    </div>
    @if (label) { <span class="progress-label">{{ label }}</span> }
  `,
  styleUrl: './progress-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() striped = false;
  @Input() animated = false;
  @Input() height = 8;
  @Input() label = '';
}
