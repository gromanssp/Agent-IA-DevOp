import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';
import { first } from 'rxjs';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start expanded (not collapsed)', (done) => {
    service.collapsed$.pipe(first()).subscribe(val => {
      expect(val).toBeFalse();
      done();
    });
  });

  it('should toggle collapsed state', (done) => {
    service.toggle();
    service.collapsed$.pipe(first()).subscribe(val => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should toggle back to expanded', (done) => {
    service.toggle();
    service.toggle();
    service.collapsed$.pipe(first()).subscribe(val => {
      expect(val).toBeFalse();
      done();
    });
  });

  it('should collapse', (done) => {
    service.collapse();
    service.collapsed$.pipe(first()).subscribe(val => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should expand', (done) => {
    service.collapse();
    service.expand();
    service.collapsed$.pipe(first()).subscribe(val => {
      expect(val).toBeFalse();
      done();
    });
  });

  it('should report isCollapsed correctly', () => {
    expect(service.isCollapsed).toBeFalse();
    service.toggle();
    expect(service.isCollapsed).toBeTrue();
    service.toggle();
    expect(service.isCollapsed).toBeFalse();
  });

  it('should start with mobile closed', (done) => {
    service.mobileOpen$.pipe(first()).subscribe(val => {
      expect(val).toBeFalse();
      done();
    });
  });

  it('should toggle mobile open state', (done) => {
    service.toggleMobile();
    service.mobileOpen$.pipe(first()).subscribe(val => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should open mobile', (done) => {
    service.openMobile();
    service.mobileOpen$.pipe(first()).subscribe(val => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should close mobile', (done) => {
    service.openMobile();
    service.closeMobile();
    service.mobileOpen$.pipe(first()).subscribe(val => {
      expect(val).toBeFalse();
      done();
    });
  });
});
