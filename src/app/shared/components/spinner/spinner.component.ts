import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<div class="spinner" [class]="variant + ' ' + size" [style.--spinner-color]="color"></div>`,
  styleUrl: './spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  @Input() variant: 'circular' | 'dots' | 'pulse' = 'circular';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color = 'var(--accent-primary)';
}
