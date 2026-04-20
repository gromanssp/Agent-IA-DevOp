import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VpsCardComponent } from './vps-card.component';
import { AgentResponse, VpsAction } from '../../models';

// Signal Inputs must be set via fixture.componentRef.setInput(), not direct assignment.
// Computed signals must be read by calling them: component.actionLabel(), component.badgeVariant().

describe('VpsCardComponent', () => {
  let component: VpsCardComponent;
  let fixture: ComponentFixture<VpsCardComponent>;

  const mockAction: AgentResponse = {
    action: VpsAction.LIST_VPS,
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
    fixture.componentRef.setInput('action', mockAction);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── actionLabel (computed signal) ────────────────────────────────────────

  it('should display correct label for list_vps', () => {
    expect(component.actionLabel()).toBe('Listar VPS');
  });

  it('should display correct label for reboot', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.REBOOT });
    expect(component.actionLabel()).toBe('Reiniciar');
  });

  it('should display correct label for power_off', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.POWER_OFF });
    expect(component.actionLabel()).toBe('Apagar');
  });

  it('should display correct label for power_on', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.POWER_ON });
    expect(component.actionLabel()).toBe('Encender');
  });

  it('should display correct label for unknown', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.UNKNOWN });
    expect(component.actionLabel()).toBe('Desconocido');
  });

  // ── badgeVariant (computed signal) ───────────────────────────────────────

  it('should return primary badge variant for list_vps', () => {
    expect(component.badgeVariant()).toBe('primary');
  });

  it('should return warning badge variant for reboot', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.REBOOT });
    expect(component.badgeVariant()).toBe('warning');
  });

  it('should return danger badge variant for power_off', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.POWER_OFF });
    expect(component.badgeVariant()).toBe('danger');
  });

  it('should return success badge variant for power_on', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.POWER_ON });
    expect(component.badgeVariant()).toBe('success');
  });

  it('should return secondary badge for unknown action', () => {
    fixture.componentRef.setInput('action', { ...mockAction, action: VpsAction.UNKNOWN });
    expect(component.badgeVariant()).toBe('secondary');
  });

  // ── DOM rendering ────────────────────────────────────────────────────────

  it('should not show .vps-name when vps_name is null', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.vps-name')).toBeNull();
  });

  it('should not show .vps-id when vps_id is null', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.vps-id')).toBeNull();
  });

  it('should show vps_name when set on initial render', async () => {
    const fix = TestBed.createComponent(VpsCardComponent);
    fix.componentRef.setInput('action', { ...mockAction, vps_name: 'produccion' });
    fix.detectChanges();
    await fix.whenStable();
    const el: HTMLElement = fix.nativeElement;
    expect(el.querySelector('.vps-name')?.textContent).toContain('produccion');
  });

  it('should show vps_id when set on initial render', async () => {
    const fix = TestBed.createComponent(VpsCardComponent);
    fix.componentRef.setInput('action', { ...mockAction, vps_id: 'vps-456' });
    fix.detectChanges();
    await fix.whenStable();
    const el: HTMLElement = fix.nativeElement;
    expect(el.querySelector('.vps-id')?.textContent).toContain('vps-456');
  });
});
