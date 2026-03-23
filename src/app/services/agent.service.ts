import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { N8nRequest, N8nResponse } from '../models/agent.models';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private webhookUrl = environment.n8nWebhookUrl;

  sendMessage(message: string, history: { role: string; content: string }[]): Observable<N8nResponse> {
    const body: N8nRequest = { message, history };
    return this.http.post<N8nResponse>(this.webhookUrl, body);
  }

  confirmAction(action: string, vpsId: string | null): Observable<N8nResponse> {
    return this.http.post<N8nResponse>(this.webhookUrl, {
      message: `CONFIRMED: ejecutar ${action} en VPS ${vpsId}`,
      history: []
    });
  }
}
