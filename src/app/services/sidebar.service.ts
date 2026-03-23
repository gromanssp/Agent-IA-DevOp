import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  private mobileOpenSubject = new BehaviorSubject<boolean>(false);

  collapsed$ = this.collapsedSubject.asObservable();
  mobileOpen$ = this.mobileOpenSubject.asObservable();

  get isCollapsed(): boolean { return this.collapsedSubject.value; }

  toggle(): void { this.collapsedSubject.next(!this.collapsedSubject.value); }
  collapse(): void { this.collapsedSubject.next(true); }
  expand(): void { this.collapsedSubject.next(false); }
  toggleMobile(): void { this.mobileOpenSubject.next(!this.mobileOpenSubject.value); }
  openMobile(): void { this.mobileOpenSubject.next(true); }
  closeMobile(): void { this.mobileOpenSubject.next(false); }
}
