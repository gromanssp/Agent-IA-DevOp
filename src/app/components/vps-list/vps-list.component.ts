import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { BadgeVariant, VpsInfo, VpsStatus } from '../../models';

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

  statusVariant(status: VpsStatus): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      [VpsStatus.ACTIVE]: BadgeVariant.SUCCESS,
      [VpsStatus.RUNNING]: BadgeVariant.SUCCESS,
      [VpsStatus.STOPPED]: BadgeVariant.DANGER,
      [VpsStatus.ERROR]: BadgeVariant.DANGER,
      [VpsStatus.RESTARTING]: BadgeVariant.WARNING,
      [VpsStatus.CREATING]: BadgeVariant.WARNING,
    };
    return map[status] ?? BadgeVariant.SECONDARY;
  }

  copiedId = signal<string | null>(null);

  copyId(id: string): void {
    navigator.clipboard.writeText(id).then(() => {
      this.copiedId.set(id);
      setTimeout(() => this.copiedId.set(null), 1500);
    });
  }
}
