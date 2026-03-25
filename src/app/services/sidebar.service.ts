import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _collapsed = signal(false);
  private _mobileOpen = signal(false);

  collapsed = this._collapsed.asReadonly();
  mobileOpen = this._mobileOpen.asReadonly();

  isCollapsed = computed(() => this._collapsed());

  toggle(): void { this._collapsed.update(v => !v); }
  collapse(): void { this._collapsed.set(true); }
  expand(): void { this._collapsed.set(false); }
  toggleMobile(): void { this._mobileOpen.update(v => !v); }
  openMobile(): void { this._mobileOpen.set(true); }
  closeMobile(): void { this._mobileOpen.set(false); }
}
