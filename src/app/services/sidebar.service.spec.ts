import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';

// SidebarService uses Angular Signals — tests read signal values directly via ()
// instead of subscribing to Observables.

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start expanded (collapsed = false)', () => {
    expect(service.collapsed()).toBeFalse();
  });

  it('should toggle to collapsed', () => {
    service.toggle();
    expect(service.collapsed()).toBeTrue();
  });

  it('should toggle back to expanded', () => {
    service.toggle();
    service.toggle();
    expect(service.collapsed()).toBeFalse();
  });

  it('should collapse', () => {
    service.collapse();
    expect(service.collapsed()).toBeTrue();
  });

  it('should expand after collapse', () => {
    service.collapse();
    service.expand();
    expect(service.collapsed()).toBeFalse();
  });

  it('should report isCollapsed correctly via computed signal', () => {
    expect(service.isCollapsed()).toBeFalse();
    service.toggle();
    expect(service.isCollapsed()).toBeTrue();
    service.toggle();
    expect(service.isCollapsed()).toBeFalse();
  });

  it('should start with mobile closed', () => {
    expect(service.mobileOpen()).toBeFalse();
  });

  it('should toggle mobile open', () => {
    service.toggleMobile();
    expect(service.mobileOpen()).toBeTrue();
  });

  it('should open mobile', () => {
    service.openMobile();
    expect(service.mobileOpen()).toBeTrue();
  });

  it('should close mobile', () => {
    service.openMobile();
    service.closeMobile();
    expect(service.mobileOpen()).toBeFalse();
  });
});
