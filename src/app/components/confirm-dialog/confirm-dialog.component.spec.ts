import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { VpsAction } from '../../models';

// Signal Inputs cannot be set with direct assignment (component.action = value).
// Use fixture.componentRef.setInput('inputName', value) instead.
// Computed signals must be called as functions: component.isDangerous() not component.isDangerous.

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('action', VpsAction.REBOOT);
    fixture.componentRef.setInput('vpsName', 'produccion');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── isDangerous (computed signal) ────────────────────────────────────────

  it('should mark reboot as dangerous', () => {
    fixture.componentRef.setInput('action', VpsAction.REBOOT);
    expect(component.isDangerous()).toBeTrue();
  });

  it('should mark power_off as dangerous', () => {
    fixture.componentRef.setInput('action', VpsAction.POWER_OFF);
    expect(component.isDangerous()).toBeTrue();
  });

  it('should not mark power_on as dangerous', () => {
    fixture.componentRef.setInput('action', VpsAction.POWER_ON);
    expect(component.isDangerous()).toBeFalse();
  });

  it('should not mark list_vps as dangerous', () => {
    fixture.componentRef.setInput('action', VpsAction.LIST_VPS);
    expect(component.isDangerous()).toBeFalse();
  });

  it('should not mark unknown as dangerous', () => {
    fixture.componentRef.setInput('action', VpsAction.UNKNOWN);
    expect(component.isDangerous()).toBeFalse();
  });

  // ── actionLabel (computed signal) ────────────────────────────────────────

  it('should return correct label for reboot', () => {
    fixture.componentRef.setInput('action', VpsAction.REBOOT);
    expect(component.actionLabel()).toBe('Reiniciar');
  });

  it('should return correct label for power_off', () => {
    fixture.componentRef.setInput('action', VpsAction.POWER_OFF);
    expect(component.actionLabel()).toBe('Apagar');
  });

  it('should return correct label for power_on', () => {
    fixture.componentRef.setInput('action', VpsAction.POWER_ON);
    expect(component.actionLabel()).toBe('Encender');
  });

  it('should return correct label for list_vps', () => {
    fixture.componentRef.setInput('action', VpsAction.LIST_VPS);
    expect(component.actionLabel()).toBe('Listar');
  });

  it('should return action string for unknown action', () => {
    fixture.componentRef.setInput('action', VpsAction.UNKNOWN);
    expect(component.actionLabel()).toBeTruthy();
  });

  // ── Output: confirmed emits { confirmed, vpsId } ─────────────────────────

  it('should emit { confirmed: true } on confirm()', () => {
    spyOn(component.confirmed, 'emit');
    component.confirm();
    expect(component.confirmed.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ confirmed: true })
    );
  });

  it('should emit { confirmed: false, vpsId: null } on cancel()', () => {
    spyOn(component.confirmed, 'emit');
    component.cancel();
    expect(component.confirmed.emit).toHaveBeenCalledWith({ confirmed: false, vpsId: null });
  });

  // ── DOM rendering ────────────────────────────────────────────────────────

  it('should display the action label (Reiniciar) in the title', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('.confirm-title');
    expect(title?.textContent).toContain('Reiniciar');
  });

  it('should apply danger class to icon when action is dangerous', () => {
    // Fixture created with REBOOT which is dangerous
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.confirm-icon.danger')).toBeTruthy();
  });

  it('should not show .confirm-message when no message is provided', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.confirm-message')).toBeNull();
  });

  it('should show .confirm-message when message is set on init', async () => {
    const fix = TestBed.createComponent(ConfirmDialogComponent);
    fix.componentRef.setInput('action', VpsAction.REBOOT);
    fix.componentRef.setInput('vpsName', 'produccion');
    fix.componentRef.setInput('message', 'Esta accion no se puede deshacer');
    fix.detectChanges();
    await fix.whenStable();
    const el: HTMLElement = fix.nativeElement;
    expect(el.querySelector('.confirm-message')?.textContent)
      .toContain('Esta accion no se puede deshacer');
  });

  it('should call confirm() when confirm button is clicked', () => {
    // Provide a vpsId so canConfirm() = true and the button is not disabled
    fixture.componentRef.setInput('vpsId', 'vps-123');
    fixture.detectChanges();

    spyOn(component, 'confirm');
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('button');
    const confirmBtn = buttons[1]; // buttons[0]=Cancel, buttons[1]=Confirm
    confirmBtn.click();
    expect(component.confirm).toHaveBeenCalled();
  });

  it('should call cancel() when cancel button is clicked', () => {
    spyOn(component, 'cancel');
    const el: HTMLElement = fixture.nativeElement;
    const cancelBtn = el.querySelector('.btn-cancel') as HTMLButtonElement;
    cancelBtn.click();
    expect(component.cancel).toHaveBeenCalled();
  });
});
