import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
  imports: [LowerCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  action = input.required<string>();
  vpsName = input.required<string>();
  message = input('');
  confirmed = output<boolean>();

  isDangerous = computed(() =>
    ['power_off', 'delete', 'reboot'].includes(this.action())
  );

  actionLabel = computed(() => {
    const labels: Record<string, string> = {
      reboot: 'Reiniciar',
      power_off: 'Apagar',
      power_on: 'Encender',
      delete: 'Eliminar',
      create: 'Crear'
    };
    return labels[this.action()] ?? this.action();
  });

  confirm(): void { this.confirmed.emit(true); }
  cancel(): void { this.confirmed.emit(false); }
}
