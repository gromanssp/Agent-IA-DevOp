import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { VpsInfo, VpsStatus } from '../../models';

@Component({
  selector: 'app-vps-list',
  standalone: true,
  templateUrl: './vps-list.component.html',
  styleUrl: './vps-list.component.css',
  imports: [BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VpsListComponent {
  vpsList = input.required<VpsInfo[]>();

  statusVariant(
    status: VpsStatus,
  ): 'success' | 'danger' | 'warning' | 'secondary' {
    const map: Record<string, 'success' | 'danger' | 'warning' | 'secondary'> =
      {
        [VpsStatus.ACTIVE]: 'success',
        [VpsStatus.RUNNING]: 'success',
        [VpsStatus.STOPPED]: 'danger',
        [VpsStatus.ERROR]: 'danger',
        [VpsStatus.RESTARTING]: 'warning',
        [VpsStatus.CREATING]: 'warning',
      };
    return map[status] ?? 'secondary';
  }
}
