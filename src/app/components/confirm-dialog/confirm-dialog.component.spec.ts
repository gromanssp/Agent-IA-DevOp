import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    component.action = 'reboot';
    component.vpsName = 'produccion';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark reboot as dangerous', () => {
    component.action = 'reboot';
    expect(component.isDangerous).toBeTrue();
  });

  it('should mark power_off as dangerous', () => {
    component.action = 'power_off';
    expect(component.isDangerous).toBeTrue();
  });

  it('should mark delete as dangerous', () => {
    component.action = 'delete';
    expect(component.isDangerous).toBeTrue();
  });

  it('should not mark power_on as dangerous', () => {
    component.action = 'power_on';
    expect(component.isDangerous).toBeFalse();
  });

  it('should not mark create as dangerous', () => {
    component.action = 'create';
    expect(component.isDangerous).toBeFalse();
  });

  it('should return correct label for reboot', () => {
    component.action = 'reboot';
    expect(component.actionLabel).toBe('Reiniciar');
  });

  it('should return correct label for power_off', () => {
    component.action = 'power_off';
    expect(component.actionLabel).toBe('Apagar');
  });

  it('should return correct label for power_on', () => {
    component.action = 'power_on';
    expect(component.actionLabel).toBe('Encender');
  });

  it('should return correct label for delete', () => {
    component.action = 'delete';
    expect(component.actionLabel).toBe('Eliminar');
  });

  it('should return correct label for create', () => {
    component.action = 'create';
    expect(component.actionLabel).toBe('Crear');
  });

  it('should return action string for unknown action label', () => {
    component.action = 'status';
    expect(component.actionLabel).toBe('status');
  });

  it('should emit true on confirm', () => {
    spyOn(component.confirmed, 'emit');
    component.confirm();
    expect(component.confirmed.emit).toHaveBeenCalledWith(true);
  });

  it('should emit false on cancel', () => {
    spyOn(component.confirmed, 'emit');
    component.cancel();
    expect(component.confirmed.emit).toHaveBeenCalledWith(false);
  });

  it('should display the vps name in the template', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('produccion');
  });

  it('should display the action label in the title', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('.confirm-title');
    expect(title?.textContent).toContain('Reiniciar');
  });

  it('should show message when provided on init', async () => {
    const fix = TestBed.createComponent(ConfirmDialogComponent);
    fix.componentInstance.action = 'reboot';
    fix.componentInstance.vpsName = 'produccion';
    fix.componentInstance.message = 'Esta accion no se puede deshacer';
    fix.detectChanges();
    await fix.whenStable();
    const el: HTMLElement = fix.nativeElement;
    expect(el.querySelector('.confirm-message')?.textContent).toContain('Esta accion no se puede deshacer');
  });

  it('should not show message element when empty', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.confirm-message')).toBeNull();
  });

  it('should apply danger class to icon for reboot', () => {
    // The fixture was created with action='reboot' which is dangerous
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.confirm-icon.danger')).toBeTruthy();
  });

  it('should call confirm when confirm button is clicked', () => {
    spyOn(component, 'confirm');
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('button');
    const confirmBtn = buttons[1]; // second button is confirm
    confirmBtn.click();
    expect(component.confirm).toHaveBeenCalled();
  });

  it('should call cancel when cancel button is clicked', () => {
    spyOn(component, 'cancel');
    const el: HTMLElement = fixture.nativeElement;
    const cancelBtn = el.querySelector('.btn-cancel') as HTMLButtonElement;
    cancelBtn.click();
    expect(component.cancel).toHaveBeenCalled();
  });
});
