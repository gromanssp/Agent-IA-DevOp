import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AgentService } from './agent.service';
import { N8nResponse } from '../models/agent.models';

describe('AgentService', () => {
  let service: AgentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
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

  it('should send a message and return N8nResponse', () => {
    const mockResponse: N8nResponse = {
      action: 'list_vps',
      vps_id: null,
      vps_name: null,
      confirm_required: false,
      user_message: 'Tienes 3 VPS activos'
    };

    service.sendMessage('cuantos VPS tengo?', []).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.action).toBe('list_vps');
      expect(response.confirm_required).toBeFalse();
    });

    const req = httpMock.expectOne('/webhook/chat');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.message).toBe('cuantos VPS tengo?');
    expect(req.request.body.history).toEqual([]);
    req.flush(mockResponse);
  });

  it('should include history in the request body', () => {
    const history = [
      { role: 'user', content: 'hola' },
      { role: 'assistant', content: 'hola, en que puedo ayudarte?' }
    ];

    service.sendMessage('lista mis VPS', history).subscribe();

    const req = httpMock.expectOne('/webhook/chat');
    expect(req.request.body.history).toEqual(history);
    expect(req.request.body.message).toBe('lista mis VPS');
    req.flush({
      action: 'list_vps',
      vps_id: null,
      vps_name: null,
      confirm_required: false,
      user_message: 'Aqui tienes tus VPS'
    });
  });

  it('should send confirmAction with formatted message', () => {
    const mockResponse: N8nResponse = {
      action: 'reboot',
      vps_id: 'vps-123',
      vps_name: 'produccion',
      confirm_required: false,
      user_message: 'VPS reiniciado correctamente'
    };

    service.confirmAction('reboot', 'vps-123').subscribe(response => {
      expect(response.action).toBe('reboot');
      expect(response.user_message).toContain('reiniciado');
    });

    const req = httpMock.expectOne('/webhook/chat');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.message).toContain('CONFIRMED');
    expect(req.request.body.message).toContain('reboot');
    expect(req.request.body.message).toContain('vps-123');
    expect(req.request.body.history).toEqual([]);
    req.flush(mockResponse);
  });

  it('should handle confirmAction with null vpsId', () => {
    service.confirmAction('list_vps', null).subscribe();

    const req = httpMock.expectOne('/webhook/chat');
    expect(req.request.body.message).toContain('null');
    req.flush({
      action: 'list_vps',
      vps_id: null,
      vps_name: null,
      confirm_required: false,
      user_message: 'ok'
    });
  });

  it('should propagate HTTP errors', () => {
    service.sendMessage('test', []).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/webhook/chat');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should propagate 404 errors', () => {
    service.sendMessage('test', []).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(404);
      }
    });

    const req = httpMock.expectOne('/webhook/chat');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
