import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
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
  confirmed = output<boolean>();

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
      [VpsAction.UNKNOWN]: 'Desconocido',
    };
    return labels[this.action()] ?? this.action();
  });

  confirm(): void { this.confirmed.emit(true); }
  cancel(): void { this.confirmed.emit(false); }
}
