import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ChatComponent } from './chat.component';
import { AgentService } from '../../services/agent.service';
import { N8nResponse } from '../../models/agent.models';
import { of, throwError } from 'rxjs';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let agentService: AgentService;
  let httpMock: HttpTestingController;

  const mockResponse: N8nResponse = {
    action: 'list_vps',
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
        provideHttpClientTesting()
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
    expect(component.messages().length).toBe(1); // only welcome msg
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

    // Flush the HTTP request
    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);
  });

  it('should clear input after sending', () => {
    component.inputText = 'test message';
    component.sendMessage();
    expect(component.inputText).toBe('');

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);
  });

  it('should set isLoading to true while waiting', () => {
    component.inputText = 'test';
    component.sendMessage();
    expect(component.isLoading()).toBeTrue();

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);
  });

  it('should handle successful response', () => {
    component.inputText = 'cuantos VPS tengo?';
    component.sendMessage();

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);

    const messages = component.messages();
    expect(messages.length).toBe(3); // welcome + user + response
    expect(messages[2].content).toBe('Tienes 3 VPS activos');
    expect(messages[2].loading).toBeFalsy();
    expect(component.isLoading()).toBeFalse();
  });

  it('should include action data in response message', () => {
    component.inputText = 'lista VPS';
    component.sendMessage();

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);

    const messages = component.messages();
    expect(messages[2].action).toEqual(mockResponse);
  });

  it('should handle confirm_required response', () => {
    const confirmResponse: N8nResponse = {
      action: 'reboot',
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: true,
      user_message: 'Deseas reiniciar produccion?'
    };

    component.inputText = 'reinicia produccion';
    component.sendMessage();

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(confirmResponse);

    expect(component.pendingConfirm()).toBeTruthy();
    expect(component.pendingConfirm()?.action).toEqual(confirmResponse);

    const messages = component.messages();
    expect(messages[2].confirmPending).toBeTrue();
  });

  it('should hide suggestions after sending a message', () => {
    component.inputText = 'test';
    component.sendMessage();

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);

    expect(component.showSuggestions()).toBeFalse();
  });

  it('should send message via useSuggestion', () => {
    component.useSuggestion('¿Cuántos VPS tengo activos?');

    const messages = component.messages();
    expect(messages[1].content).toBe('¿Cuántos VPS tengo activos?');

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);
  });

  it('should send text parameter instead of inputText when provided', () => {
    component.inputText = 'should not send this';
    component.sendMessage('send this instead');

    const messages = component.messages();
    expect(messages[1].content).toBe('send this instead');

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);
  });

  it('should handle HTTP error', () => {
    component.inputText = 'test';
    component.sendMessage();

    const req = httpMock.expectOne('/webhook/chat');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    const messages = component.messages();
    const lastMsg = messages[messages.length - 1];
    expect(lastMsg.content).toContain('Error');
    expect(lastMsg.loading).toBeFalsy();
    expect(component.isLoading()).toBeFalse();
  });

  it('should confirm action and send confirmAction request', () => {
    // First, set up a pending confirmation
    const confirmResponse: N8nResponse = {
      action: 'reboot',
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: true,
      user_message: 'Deseas reiniciar produccion?'
    };

    component.inputText = 'reinicia produccion';
    component.sendMessage();

    const req1 = httpMock.expectOne('/webhook/chat');
    req1.flush(confirmResponse);

    // Now confirm the action
    component.onConfirm(true);

    const messages = component.messages();
    const loadingMsg = messages[messages.length - 1];
    expect(loadingMsg.loading).toBeTrue();
    expect(component.pendingConfirm()).toBeNull();

    // Flush the confirm request
    const req2 = httpMock.expectOne('/webhook/chat');
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
    const confirmResponse: N8nResponse = {
      action: 'reboot',
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: true,
      user_message: 'Deseas reiniciar?'
    };

    component.inputText = 'reinicia produccion';
    component.sendMessage();

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(confirmResponse);

    component.onConfirm(false);

    expect(component.pendingConfirm()).toBeNull();
    const messages = component.messages();
    const lastMsg = messages[messages.length - 1];
    expect(lastMsg.content).toContain('cancelada');
  });

  it('should do nothing on onConfirm if no pending action', () => {
    const msgCount = component.messages().length;
    component.onConfirm(true);
    expect(component.messages().length).toBe(msgCount);
  });

  it('should handle Enter key press', () => {
    component.inputText = 'test enter';
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false });
    spyOn(event, 'preventDefault');
    component.onKeydown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.messages().length).toBe(3);

    const req = httpMock.expectOne('/webhook/chat');
    req.flush(mockResponse);
  });

  it('should not send on Shift+Enter', () => {
    component.inputText = 'test';
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.onKeydown(event);

    expect(component.messages().length).toBe(1); // only welcome
  });

  it('should not send on other keys', () => {
    component.inputText = 'test';
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.onKeydown(event);

    expect(component.messages().length).toBe(1);
  });

  it('should limit history to last 10 non-loading messages', () => {
    // Send multiple messages to build up history
    for (let i = 0; i < 6; i++) {
      component.inputText = `message ${i}`;
      component.sendMessage();
      const req = httpMock.expectOne('/webhook/chat');
      req.flush({ ...mockResponse, user_message: `response ${i}` });
    }

    // Send one more and check the history in the request
    component.inputText = 'final message';
    component.sendMessage();

    const req = httpMock.expectOne('/webhook/chat');
    expect(req.request.body.history.length).toBeLessThanOrEqual(10);
    req.flush(mockResponse);
  });
});
