import { Component, input, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { VpsAction } from '../../models';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  action = input.required<VpsAction>();
  vpsName = input.required<string>();
  message = input('');
  vpsId = input<string | null>(null);

  confirmed = output<{ confirmed: boolean; vpsId: string | null }>();

  enteredId = signal('');

  requiresId = computed(() => this.vpsId() === null);
  canConfirm = computed(() => !this.requiresId() || !!this.enteredId().trim());

  isDangerous = computed(() =>
    [VpsAction.POWER_OFF, VpsAction.DELETE, VpsAction.REBOOT].includes(this.action())
  );

  actionLabel = computed(() => {
    const labels: Record<VpsAction, string> = {
      [VpsAction.REBOOT]: 'Reiniciar',
      [VpsAction.POWER_OFF]: 'Apagar',
      [VpsAction.POWER_ON]: 'Encender',
      [VpsAction.DELETE]: 'Eliminar',
      [VpsAction.METRICS]: 'Metricas',
      [VpsAction.LIST_VPS]: 'Listar',
      [VpsAction.VPS_PLANS]: 'Planes VPS',
      [VpsAction.STATUS]: 'Estado',
      [VpsAction.UNKNOWN]: 'Desconocida',
    };
    return labels[this.action()] ?? this.action();
  });

  confirm(): void {
    this.confirmed.emit({
      confirmed: true,
      vpsId: this.requiresId() ? this.enteredId().trim() : this.vpsId(),
    });
  }

  cancel(): void {
    this.confirmed.emit({ confirmed: false, vpsId: null });
  }
}
