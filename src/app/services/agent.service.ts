import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AgentRequest, AgentResponse, ChatRole, VpsAction } from '../models';
import { ResponseNormalizerService } from './response-normalizer.service';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private normalizer = inject(ResponseNormalizerService);
  private webhookUrl = environment.n8nWebhookUrl;

  sendMessage(
    message: string,
    history: { role: ChatRole; content: string }[],
  ): Observable<AgentResponse> {
    const body: AgentRequest = { message, history };
    return this.http
      .post<unknown>(this.webhookUrl, body)
      .pipe(map((raw) => this.normalizer.normalize(raw)));
  }

  confirmAction(action: VpsAction, vpsId: string | null): Observable<AgentResponse> {
    return this.http
      .post<unknown>(this.webhookUrl, {
        message: `CONFIRMED: ejecutar ${action} en VPS ${vpsId}`,
        history: [],
      })
      .pipe(map((raw) => this.normalizer.normalize(raw)));
  }
}
