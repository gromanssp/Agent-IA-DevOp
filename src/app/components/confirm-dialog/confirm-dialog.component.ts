import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
  imports: [LowerCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  @Input({ required: true }) action!: string;
  @Input({ required: true }) vpsName!: string;
  @Input() message = '';
  @Output() confirmed = new EventEmitter<boolean>();

  get isDangerous(): boolean {
    return ['power_off', 'delete', 'reboot'].includes(this.action);
  }

  get actionLabel(): string {
    const labels: Record<string, string> = {
      reboot: 'Reiniciar',
      power_off: 'Apagar',
      power_on: 'Encender',
      delete: 'Eliminar',
      create: 'Crear'
    };
    return labels[this.action] ?? this.action;
  }

  confirm(): void { this.confirmed.emit(true); }
  cancel(): void { this.confirmed.emit(false); }
}
