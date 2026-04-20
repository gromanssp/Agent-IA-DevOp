import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AgentService } from './agent.service';
import { AgentResponse, VpsAction, ChatRole } from '../models';
import { ACTION_HANDLERS } from './handlers/action-handler.token';
import { VpsListHandler } from './handlers/vps-list.handler';
import { VpsPlansHandler } from './handlers/vps-plans.handler';
import { VpsMetricsHandler } from './handlers/vps-metrics.handler';
import { VpsSingleHandler } from './handlers/vps-single.handler';
import { AgentResponseHandler } from './handlers/agent-response.handler';

describe('AgentService', () => {
  let service: AgentService;
  let httpMock: HttpTestingController;

  const mockResponse: AgentResponse = {
    action: VpsAction.LIST_VPS,
    vps_id: null,
    vps_name: null,
    confirm_required: false,
    user_message: 'Tienes 3 VPS activos'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ACTION_HANDLERS, useClass: VpsListHandler,       multi: true },
        { provide: ACTION_HANDLERS, useClass: VpsPlansHandler,      multi: true },
        { provide: ACTION_HANDLERS, useClass: VpsMetricsHandler,    multi: true },
        { provide: ACTION_HANDLERS, useClass: VpsSingleHandler,     multi: true },
        { provide: ACTION_HANDLERS, useClass: AgentResponseHandler, multi: true },
      ]
    });
    service = TestBed.inject(AgentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a message and return AgentResponse', () => {
    service.sendMessage('cuantos VPS tengo?', []).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.action).toBe(VpsAction.LIST_VPS);
      expect(response.confirm_required).toBeFalse();
    });

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.message).toBe('cuantos VPS tengo?');
    expect(req.request.body.history).toEqual([]);
    req.flush(mockResponse);
  });

  it('should include history in the request body', () => {
    const history = [
      { role: ChatRole.USER, content: 'hola' },
      { role: ChatRole.ASSISTANT, content: 'hola, en que puedo ayudarte?' }
    ];

    service.sendMessage('lista mis VPS', history).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    expect(req.request.body.history).toEqual(history);
    expect(req.request.body.message).toBe('lista mis VPS');
    req.flush(mockResponse);
  });

  it('should send confirmAction with formatted message', () => {
    const rebootResponse: AgentResponse = {
      action: VpsAction.REBOOT,
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: false,
      user_message: 'VPS reiniciado correctamente'
    };

    service.confirmAction(VpsAction.REBOOT, 'vps-123').subscribe(response => {
      expect(response.action).toBe(VpsAction.REBOOT);
      expect(response.user_message).toContain('reiniciado');
    });

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.message).toContain('CONFIRMED');
    expect(req.request.body.message).toContain('reboot');
    expect(req.request.body.message).toContain('vps-123');
    expect(req.request.body.history).toEqual([]);
    req.flush(rebootResponse);
  });

  it('should handle confirmAction with null vpsId', () => {
    service.confirmAction(VpsAction.LIST_VPS, null).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    expect(req.request.body.message).toContain('null');
    req.flush(mockResponse);
  });

  it('should propagate HTTP 500 errors', () => {
    service.sendMessage('test', []).subscribe({
      next: () => fail('should have failed'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should propagate HTTP 404 errors', () => {
    service.sendMessage('test', []).subscribe({
      next: () => fail('should have failed'),
      error: (err) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  // ── sanitizeMessage — security hardening tests ───────────────────────────

  describe('sanitizeMessage', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(service.sanitizeMessage('  hola  ')).toBe('hola');
    });

    it('should truncate messages longer than 500 characters', () => {
      const long = 'a'.repeat(600);
      expect(service.sanitizeMessage(long).length).toBe(500);
    });

    it('should strip NUL control character (log injection vector)', () => {
      expect(service.sanitizeMessage('hola\x00mundo')).toBe('holamundo');
    });

    it('should strip BEL control character', () => {
      expect(service.sanitizeMessage('hola\x07mundo')).toBe('holamundo');
    });

    it('should strip ESC control character (ANSI escape / prompt injection)', () => {
      expect(service.sanitizeMessage('hola\x1Bmundo')).toBe('holamundo');
    });

    it('should preserve tab and newline (legitimate whitespace)', () => {
      expect(service.sanitizeMessage('linea1\nlinea2\ttab')).toBe('linea1\nlinea2\ttab');
    });

    it('should collapse 3+ consecutive newlines into one (prompt injection vector)', () => {
      expect(service.sanitizeMessage('hola\n\n\n\nmundo')).toBe('hola\nmundo');
    });

    it('should collapse 3+ consecutive spaces', () => {
      expect(service.sanitizeMessage('hola   mundo')).toBe('hola mundo');
    });

    it('should return empty string when given only control chars', () => {
      expect(service.sanitizeMessage('\x00\x01\x02')).toBe('');
    });

    it('should not alter normal conversational messages', () => {
      const normal = 'reinicia el servidor de produccion';
      expect(service.sanitizeMessage(normal)).toBe(normal);
    });

    it('should send sanitized message to webhook — no raw control chars reach n8n', () => {
      service.sendMessage('hola\x00mundo\n\n\n\nfin', []).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/webhook/'));
      expect(req.request.body.message).toBe('holamundo\nfin');

      // SECURITY: API key must never appear in the POST body
      expect(req.request.body.cubepathApiKey).toBeUndefined();
      expect(req.request.body.apiKey).toBeUndefined();
      expect(req.request.body.token).toBeUndefined();

      req.flush(mockResponse);
    });
  });
});
