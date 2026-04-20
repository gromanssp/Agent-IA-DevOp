import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ChatComponent } from './chat.component';
import { AgentService } from '../../services/agent.service';
import { AgentResponse, VpsAction } from '../../models';
import { ACTION_HANDLERS } from '../../services/handlers/action-handler.token';
import { VpsListHandler } from '../../services/handlers/vps-list.handler';
import { VpsPlansHandler } from '../../services/handlers/vps-plans.handler';
import { VpsMetricsHandler } from '../../services/handlers/vps-metrics.handler';
import { VpsSingleHandler } from '../../services/handlers/vps-single.handler';
import { AgentResponseHandler } from '../../services/handlers/agent-response.handler';

// onConfirm signature: onConfirm(result: { confirmed: boolean; vpsId: string | null })
// NOT onConfirm(boolean) — always pass the full result object.

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let agentService: AgentService;
  let httpMock: HttpTestingController;

  const mockResponse: AgentResponse = {
    action: VpsAction.LIST_VPS,
    vps_id: null,
    vps_name: null,
    confirm_required: false,
    user_message: 'Tienes 3 VPS activos'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ACTION_HANDLERS, useClass: VpsListHandler,       multi: true },
        { provide: ACTION_HANDLERS, useClass: VpsPlansHandler,      multi: true },
        { provide: ACTION_HANDLERS, useClass: VpsMetricsHandler,    multi: true },
        { provide: ACTION_HANDLERS, useClass: VpsSingleHandler,     multi: true },
        { provide: ACTION_HANDLERS, useClass: AgentResponseHandler, multi: true },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    agentService = TestBed.inject(AgentService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a welcome message', () => {
    const messages = component.messages();
    expect(messages.length).toBe(1);
    expect(messages[0].role).toBe('assistant');
    expect(messages[0].content).toContain('DevOps');
  });

  it('should show suggestions when only welcome message exists', () => {
    expect(component.showSuggestions()).toBeTrue();
  });

  it('should have 4 suggestions', () => {
    expect(component.suggestions.length).toBe(4);
  });

  it('should not send empty messages', () => {
    component.inputText = '   ';
    component.sendMessage();
    expect(component.messages().length).toBe(1);
  });

  it('should not send when loading', () => {
    component.isLoading.set(true);
    component.inputText = 'test';
    component.sendMessage();
    expect(component.messages().length).toBe(1);
  });

  it('should add user and loading messages on send', () => {
    component.inputText = 'cuantos VPS tengo?';
    component.sendMessage();

    const messages = component.messages();
    expect(messages.length).toBe(3); // welcome + user + loading
    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toBe('cuantos VPS tengo?');
    expect(messages[2].loading).toBeTrue();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);
  });

  it('should clear input after sending', () => {
    component.inputText = 'test message';
    component.sendMessage();
    expect(component.inputText).toBe('');

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);
  });

  it('should set isLoading to true while waiting', () => {
    component.inputText = 'test';
    component.sendMessage();
    expect(component.isLoading()).toBeTrue();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);
  });

  it('should handle successful response', () => {
    component.inputText = 'cuantos VPS tengo?';
    component.sendMessage();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);

    const messages = component.messages();
    expect(messages.length).toBe(3);
    expect(messages[2].content).toBe('Tienes 3 VPS activos');
    expect(messages[2].loading).toBeFalsy();
    expect(component.isLoading()).toBeFalse();
  });

  it('should include action data in response message', () => {
    component.inputText = 'lista VPS';
    component.sendMessage();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);

    const messages = component.messages();
    expect(messages[2].action).toEqual(mockResponse);
  });

  it('should handle confirm_required response', () => {
    const confirmResponse: AgentResponse = {
      action: VpsAction.REBOOT,
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: true,
      user_message: 'Deseas reiniciar produccion?'
    };

    component.inputText = 'reinicia produccion';
    component.sendMessage();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(confirmResponse);

    expect(component.pendingConfirm()).toBeTruthy();
    expect(component.pendingConfirm()?.action).toEqual(confirmResponse);

    const messages = component.messages();
    expect(messages[2].confirmPending).toBeTrue();
  });

  it('should hide suggestions after sending a message', () => {
    component.inputText = 'test';
    component.sendMessage();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);

    expect(component.showSuggestions()).toBeFalse();
  });

  it('should send message via useSuggestion', () => {
    component.useSuggestion('¿Cuántos VPS tengo activos?');

    const messages = component.messages();
    expect(messages[1].content).toBe('¿Cuántos VPS tengo activos?');

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);
  });

  it('should send text parameter instead of inputText when provided', () => {
    component.inputText = 'should not send this';
    component.sendMessage('send this instead');

    const messages = component.messages();
    expect(messages[1].content).toBe('send this instead');

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);
  });

  it('should handle HTTP error', () => {
    component.inputText = 'test';
    component.sendMessage();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    const messages = component.messages();
    const lastMsg = messages[messages.length - 1];
    expect(lastMsg.content).toContain('Error');
    expect(lastMsg.loading).toBeFalsy();
    expect(component.isLoading()).toBeFalse();
  });

  it('should confirm action and send confirmAction request', () => {
    const confirmResponse: AgentResponse = {
      action: VpsAction.REBOOT,
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: true,
      user_message: 'Deseas reiniciar produccion?'
    };

    component.inputText = 'reinicia produccion';
    component.sendMessage();

    const req1 = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req1.flush(confirmResponse);

    // onConfirm receives { confirmed, vpsId } — not a plain boolean
    component.onConfirm({ confirmed: true, vpsId: 'vps-123' });

    const messages = component.messages();
    const loadingMsg = messages[messages.length - 1];
    expect(loadingMsg.loading).toBeTrue();
    expect(component.pendingConfirm()).toBeNull();

    const req2 = httpMock.expectOne(r => r.url.includes('/webhook/'));
    expect(req2.request.body.message).toContain('CONFIRMED');
    req2.flush({
      ...confirmResponse,
      confirm_required: false,
      user_message: 'VPS reiniciado correctamente'
    });

    const finalMessages = component.messages();
    expect(finalMessages[finalMessages.length - 1].content).toContain('reiniciado');
  });

  it('should cancel confirmation and add cancel message', () => {
    const confirmResponse: AgentResponse = {
      action: VpsAction.REBOOT,
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: true,
      user_message: 'Deseas reiniciar?'
    };

    component.inputText = 'reinicia produccion';
    component.sendMessage();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(confirmResponse);

    component.onConfirm({ confirmed: false, vpsId: null });

    expect(component.pendingConfirm()).toBeNull();
    const messages = component.messages();
    const lastMsg = messages[messages.length - 1];
    expect(lastMsg.content).toContain('cancelada');
  });

  it('should do nothing on onConfirm if no pending action', () => {
    const msgCount = component.messages().length;
    component.onConfirm({ confirmed: true, vpsId: null });
    expect(component.messages().length).toBe(msgCount);
  });

  it('should send on Enter key', () => {
    component.inputText = 'test enter';
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false });
    spyOn(event, 'preventDefault');
    component.onKeydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.messages().length).toBe(3);

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush(mockResponse);
  });

  it('should not send on Shift+Enter', () => {
    component.inputText = 'test';
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.onKeydown(event);
    expect(component.messages().length).toBe(1);
  });

  it('should not send on other keys', () => {
    component.inputText = 'test';
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.onKeydown(event);
    expect(component.messages().length).toBe(1);
  });

  it('should limit history to last 10 non-loading messages', () => {
    for (let i = 0; i < 6; i++) {
      component.inputText = `message ${i}`;
      component.sendMessage();
      const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
      req.flush({ ...mockResponse, user_message: `response ${i}` });
    }

    component.inputText = 'final message';
    component.sendMessage();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    expect(req.request.body.history.length).toBeLessThanOrEqual(10);
    req.flush(mockResponse);
  });
});
