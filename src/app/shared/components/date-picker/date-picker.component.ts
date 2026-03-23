import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  template: '<div class="date-picker"><input type="date" [placeholder]="placeholder" class="form-control"></div>',
  styleUrl: './date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent {
  @Input() mode: 'single' | 'range' | 'minmax' = 'single';
  @Input() value: Date | null = null;
  @Input() rangeStart: Date | null = null;
  @Input() rangeEnd: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() placeholder = 'Select date';
  @Output() dateChange = new EventEmitter<Date>();
  @Output() rangeChange = new EventEmitter<{ start: Date; end: Date }>();
}
