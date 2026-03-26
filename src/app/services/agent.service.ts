import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AgentRequest,
  AgentResponse,
  ChatRole,
  VpsAction,
  isVpsApiItem,
  isVpsApiList,
  mapVpsApiToInfo,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private webhookUrl = environment.n8nWebhookUrl;

  sendMessage(
    message: string,
    history: { role: ChatRole; content: string }[],
  ): Observable<AgentResponse> {
    const body: AgentRequest = { message, history };
    return this.http
      .post<unknown>(this.webhookUrl, body)
      .pipe(map((raw) => this.normalizeResponse(raw)));
  }

  confirmAction(
    action: VpsAction,
    vpsId: string | null,
  ): Observable<AgentResponse> {
    return this.http
      .post<unknown>(this.webhookUrl, {
        message: `CONFIRMED: ejecutar ${action} en VPS ${vpsId}`,
        history: [],
      })
      .pipe(map((raw) => this.normalizeResponse(raw)));
  }

  private normalizeResponse(raw: unknown): AgentResponse {
    console.log('Raw n8n response:', raw);
    const data = this.unwrap(raw);

    // Array de VPS crudos → list_vps
    if (isVpsApiList(data)) {
      const vpsList = data.map(mapVpsApiToInfo);
      return {
        action: VpsAction.LIST_VPS,
        vps_id: null,
        vps_name: null,
        confirm_required: false,
        user_message: `Se encontraron ${vpsList.length} servidor(es) VPS.`,
        vpsData: vpsList,
      };
    }

    // Un solo VPS crudo → get_vps
    if (isVpsApiItem(data)) {
      const vps = mapVpsApiToInfo(data);
      return {
        action: VpsAction.GET_VPS,
        vps_id: vps.id,
        vps_name: vps.name,
        confirm_required: false,
        user_message: `VPS "${vps.name}" — ${vps.status}`,
        vpsData: [vps],
      };
    }

    // Objeto con estructura AgentResponse (o parcial)
    const obj = (
      Array.isArray(data) ? data[0] ?? {} : data ?? {}
    ) as Record<string, unknown>;

    // n8n AI Agent puede anidar la respuesta en "output"
    if (typeof obj['output'] === 'string') {
      try {
        const parsed = this.unwrap(JSON.parse(obj['output']));
        if (isVpsApiList(parsed) || isVpsApiItem(parsed)) {
          return this.normalizeResponse(parsed);
        }
        Object.assign(obj, parsed);
      } catch {
        obj['user_message'] = obj['output'];
      }
    }

    return {
      action: (obj['action'] as VpsAction) ?? VpsAction.UNKNOWN,
      vps_id: (obj['vps_id'] as string) ?? null,
      vps_name: (obj['vps_name'] as string) ?? null,
      confirm_required: Boolean(obj['confirm_required']),
      user_message: (obj['user_message'] as string) || 'Respuesta recibida.',
    };
  }

  /** Desenvuelve formatos de n8n: arrays anidados y wrappers {json: ...} */
  private unwrap(data: unknown): unknown {
    if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0])) {
      return this.unwrap(data[0]);
    }

    if (Array.isArray(data) && data.length > 0 && this.isN8nItem(data[0])) {
      return data.map((item) => (item as Record<string, unknown>)['json']);
    }

    if (this.isN8nItem(data)) {
      return (data as Record<string, unknown>)['json'];
    }

    if (typeof data === 'string') {
      try {
        return this.unwrap(JSON.parse(data));
      } catch {
        return data;
      }
    }

    return data;
  }

  private isN8nItem(item: unknown): boolean {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    return 'json' in (item as Record<string, unknown>);
  }
}
