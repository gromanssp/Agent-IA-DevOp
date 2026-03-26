import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { AgentResponse, VpsAction } from '../../models';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-vps-card',
  standalone: true,
  templateUrl: './vps-card.component.html',
  styleUrl: './vps-card.component.css',
  imports: [BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VpsCardComponent {
  action = input.required<AgentResponse>();

  actionLabel = computed(() => {
    const labels: Record<VpsAction, string> = {
      [VpsAction.LIST_VPS]: 'Listar VPS',
      [VpsAction.GET_VPS]: 'Detalle VPS',
      [VpsAction.REBOOT]: 'Reiniciar',
      [VpsAction.POWER_OFF]: 'Apagar',
      [VpsAction.POWER_ON]: 'Encender',
      [VpsAction.CREATE]: 'Crear VPS',
      [VpsAction.DELETE]: 'Eliminar',
      [VpsAction.STATUS]: 'Estado',
      [VpsAction.UNKNOWN]: 'Desconocido',
    };
    return labels[this.action().action] ?? this.action().action;
  });

  badgeVariant = computed<'primary' | 'success' | 'warning' | 'danger' | 'secondary'>(() => {
    const map: Record<VpsAction, 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      [VpsAction.LIST_VPS]: 'primary',
      [VpsAction.GET_VPS]: 'primary',
      [VpsAction.REBOOT]: 'warning',
      [VpsAction.POWER_OFF]: 'danger',
      [VpsAction.POWER_ON]: 'success',
      [VpsAction.CREATE]: 'success',
      [VpsAction.DELETE]: 'danger',
      [VpsAction.STATUS]: 'secondary',
      [VpsAction.UNKNOWN]: 'secondary',
    };
    return map[this.action().action] ?? 'secondary';
  });
}
