import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  isOpen = input(false);
  title = input('');
  size = input<'sm' | 'md' | 'lg'>('md');
  closed = output<void>();

  close(): void {
    this.closed.emit();
  }
}
