import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VpsCardComponent } from './vps-card.component';
import { N8nResponse } from '../../models/agent.models';

describe('VpsCardComponent', () => {
  let component: VpsCardComponent;
  let fixture: ComponentFixture<VpsCardComponent>;

  const mockAction: N8nResponse = {
    action: 'list_vps',
    vps_id: null,
    vps_name: null,
    confirm_required: false,
    user_message: 'Tienes 3 VPS activos'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VpsCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VpsCardComponent);
    component = fixture.componentInstance;
    component.action = mockAction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct label for list_vps action', () => {
    expect(component.actionLabel).toBe('Listar VPS');
  });

  it('should return primary badge variant for list_vps', () => {
    expect(component.badgeVariant).toBe('primary');
  });

  it('should display correct label for reboot action', () => {
    component.action = { ...mockAction, action: 'reboot' };
    expect(component.actionLabel).toBe('Reiniciar');
  });

  it('should return warning badge variant for reboot', () => {
    component.action = { ...mockAction, action: 'reboot' };
    expect(component.badgeVariant).toBe('warning');
  });

  it('should display correct label for power_off action', () => {
    component.action = { ...mockAction, action: 'power_off' };
    expect(component.actionLabel).toBe('Apagar');
  });

  it('should return danger badge variant for power_off', () => {
    component.action = { ...mockAction, action: 'power_off' };
    expect(component.badgeVariant).toBe('danger');
  });

  it('should display correct label for power_on action', () => {
    component.action = { ...mockAction, action: 'power_on' };
    expect(component.actionLabel).toBe('Encender');
  });

  it('should return success badge variant for power_on', () => {
    component.action = { ...mockAction, action: 'power_on' };
    expect(component.badgeVariant).toBe('success');
  });

  it('should display correct label for create action', () => {
    component.action = { ...mockAction, action: 'create' };
    expect(component.actionLabel).toBe('Crear VPS');
  });

  it('should return success badge for create', () => {
    component.action = { ...mockAction, action: 'create' };
    expect(component.badgeVariant).toBe('success');
  });

  it('should display correct label for delete action', () => {
    component.action = { ...mockAction, action: 'delete' };
    expect(component.actionLabel).toBe('Eliminar');
  });

  it('should return danger badge for delete', () => {
    component.action = { ...mockAction, action: 'delete' };
    expect(component.badgeVariant).toBe('danger');
  });

  it('should return secondary badge for unknown action', () => {
    component.action = { ...mockAction, action: 'unknown' };
    expect(component.badgeVariant).toBe('secondary');
    expect(component.actionLabel).toBe('Desconocido');
  });

  it('should show vps_name when present on init', async () => {
    const fix = TestBed.createComponent(VpsCardComponent);
    fix.componentInstance.action = { ...mockAction, vps_name: 'produccion' };
    fix.detectChanges();
    await fix.whenStable();
    const el: HTMLElement = fix.nativeElement;
    expect(el.querySelector('.vps-name')?.textContent).toContain('produccion');
  });

  it('should not show vps_name when null', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.vps-name')).toBeNull();
  });

  it('should show vps_id when present on init', async () => {
    const fix = TestBed.createComponent(VpsCardComponent);
    fix.componentInstance.action = { ...mockAction, vps_id: 'vps-456' };
    fix.detectChanges();
    await fix.whenStable();
    const el: HTMLElement = fix.nativeElement;
    expect(el.querySelector('.vps-id')?.textContent).toContain('vps-456');
  });

  it('should not show vps_id when null', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.vps-id')).toBeNull();
  });
});
