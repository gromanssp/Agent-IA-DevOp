import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { AgentResponse, BadgeVariant, VpsAction } from '../../models';
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
      [VpsAction.VPS_PLANS]: 'Planes VPS',
      [VpsAction.REBOOT]: 'Reiniciar',
      [VpsAction.POWER_OFF]: 'Apagar',
      [VpsAction.POWER_ON]: 'Encender',
      [VpsAction.METRICS]: 'Metricas',
      [VpsAction.DELETE]: 'Eliminar',
      [VpsAction.STATUS]: 'Estado',
      [VpsAction.UNKNOWN]: 'Desconocido',
    };
    return labels[this.action().action] ?? this.action().action;
  });

  badgeVariant = computed<BadgeVariant>(() => {
    const map: Record<VpsAction, BadgeVariant> = {
      [VpsAction.LIST_VPS]: BadgeVariant.PRIMARY,
      [VpsAction.VPS_PLANS]: BadgeVariant.PRIMARY,
      [VpsAction.REBOOT]: BadgeVariant.WARNING,
      [VpsAction.POWER_OFF]: BadgeVariant.DANGER,
      [VpsAction.POWER_ON]: BadgeVariant.SUCCESS,
      [VpsAction.METRICS]: BadgeVariant.PRIMARY,
      [VpsAction.DELETE]: BadgeVariant.DANGER,
      [VpsAction.STATUS]: BadgeVariant.SECONDARY,
      [VpsAction.UNKNOWN]: BadgeVariant.SECONDARY,
    };
    return map[this.action().action] ?? BadgeVariant.SECONDARY;
  });
}
