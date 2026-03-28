import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AgentRequest, AgentResponse, ChatRole, VpsAction } from '../models';
import { ResponseNormalizerService } from './response-normalizer.service';
import { WebhookModeService } from './webhook-mode.service';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private normalizer = inject(ResponseNormalizerService);
  private webhookMode = inject(WebhookModeService);

  sendMessage(
    message: string,
    history: { role: ChatRole; content: string }[],
  ): Observable<AgentResponse> {
    const body: AgentRequest = { message, history };
    return this.http
      .post<unknown>(this.webhookMode.webhookUrl(), body)
      .pipe(map((raw) => this.normalizer.normalize(raw)));
  }

  confirmAction(action: VpsAction, vpsId: string | null): Observable<AgentResponse> {
    return this.http
      .post<unknown>(this.webhookMode.webhookUrl(), {
        message: `CONFIRMED: ejecutar ${action} en VPS ${vpsId}`,
        history: [],
      })
      .pipe(map((raw) => this.normalizer.normalize(raw)));
  }
}
