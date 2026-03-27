import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { VpsPlans, VpsPlanLocation } from '../../models';

@Component({
  selector: 'app-vps-plans',
  standalone: true,
  templateUrl: './vps-plans.component.html',
  styleUrl: './vps-plans.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VpsPlansComponent {
  plans = input.required<VpsPlans>();

  selectedLocationIndex = signal(0);
  selectedClusterIndex = signal(0);

  selectedLocation = computed<VpsPlanLocation>(
    () => this.plans().locations[this.selectedLocationIndex()] ?? this.plans().locations[0],
  );

  selectLocation(index: number): void {
    this.selectedLocationIndex.set(index);
    this.selectedClusterIndex.set(0);
  }

  selectCluster(index: number): void {
    this.selectedClusterIndex.set(index);
  }

  formatRam(gb: number): string {
    return gb >= 1 ? `${gb} GB` : `${gb * 1024} MB`;
  }

  locationFlag(name: string): string {
    if (name.startsWith('eu-')) return '🇪🇺';
    if (name.includes('hou')) return '🇺🇸';
    if (name.includes('mia')) return '🇺🇸';
    return '🌐';
  }
}
