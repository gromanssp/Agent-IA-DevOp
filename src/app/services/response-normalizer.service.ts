import { Injectable, inject } from '@angular/core';
import { AgentResponse, isVpsApiList, isVpsApiItem, isVpsMetricsApi, isVpsPlansApi } from '../models';
import { ACTION_HANDLERS } from './handlers/action-handler.token';

@Injectable({ providedIn: 'root' })
export class ResponseNormalizerService {
  private handlers = inject(ACTION_HANDLERS);

  normalize(raw: unknown): AgentResponse {
    console.log('Raw n8n response:', raw);
    const data = this.resolveData(this.unwrap(raw));
    const handler = this.handlers.find((h) => h.canHandle(data));
    return handler!.handle(data);
  }

  /**
   * Si el dato tiene un campo "output" string (formato AI Agent de n8n),
   * intenta parsearlo como JSON y lo resuelve como dato estructurado.
   */
  private resolveData(data: unknown): unknown {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
    const obj = data as Record<string, unknown>;
    if (typeof obj['output'] !== 'string') return data;

    try {
      const parsed = this.unwrap(JSON.parse(obj['output']));
      const isStructured =
        isVpsApiList(parsed) || isVpsApiItem(parsed) ||
        isVpsMetricsApi(parsed) || isVpsPlansApi(parsed);
      return isStructured ? parsed : { ...obj, ...(parsed as object) };
    } catch {
      return { ...obj, user_message: obj['output'] };
    }
  }

  /** Desenvuelve formatos de n8n: arrays anidados, wrappers {json: ...} y {text: "..."} */
  private unwrap(data: unknown): unknown {
    if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0])) {
      return this.unwrap(data[0]);
    }
    if (Array.isArray(data) && data.length > 0 && this.isN8nItem(data[0])) {
      return data.map((item) => (item as Record<string, unknown>)['json']);
    }
    if (Array.isArray(data) && data.length > 0 && this.isN8nTextItem(data[0])) {
      const text = (data[0] as Record<string, unknown>)['text'] as string;
      try { return this.unwrap(JSON.parse(text)); } catch { return data; }
    }
    if (this.isN8nItem(data)) {
      return (data as Record<string, unknown>)['json'];
    }
    if (this.isN8nTextItem(data)) {
      const text = (data as Record<string, unknown>)['text'] as string;
      try { return this.unwrap(JSON.parse(text)); } catch { return data; }
    }
    if (typeof data === 'string') {
      try { return this.unwrap(JSON.parse(data)); } catch { return data; }
    }
    return data;
  }

  private isN8nItem(item: unknown): boolean {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    return 'json' in (item as Record<string, unknown>);
  }

  private isN8nTextItem(item: unknown): boolean {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
    return typeof (item as Record<string, unknown>)['text'] === 'string';
  }
}
