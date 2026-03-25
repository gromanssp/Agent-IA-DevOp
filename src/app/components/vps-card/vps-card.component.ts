import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { N8nResponse } from '../../models/agent.models';
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
  action = input.required<N8nResponse>();

  actionLabel = computed(() => {
    const labels: Record<string, string> = {
      list_vps: 'Listar VPS',
      get_vps: 'Detalle VPS',
      reboot: 'Reiniciar',
      power_off: 'Apagar',
      power_on: 'Encender',
      create: 'Crear VPS',
      delete: 'Eliminar',
      status: 'Estado',
      unknown: 'Desconocido'
    };
    return labels[this.action().action] ?? this.action().action;
  });

  badgeVariant = computed<'primary' | 'success' | 'warning' | 'danger' | 'secondary'>(() => {
    const map: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      list_vps: 'primary',
      get_vps: 'primary',
      reboot: 'warning',
      power_off: 'danger',
      power_on: 'success',
      create: 'success',
      delete: 'danger',
      status: 'secondary',
      unknown: 'secondary'
    };
    return map[this.action().action] ?? 'secondary';
  });
}
