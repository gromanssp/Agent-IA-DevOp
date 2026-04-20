import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AgentRequest, AgentResponse, ChatRole, VpsAction } from '../models';
import { ResponseNormalizerService } from './response-normalizer.service';
import { WebhookModeService } from './webhook-mode.service';

/** Maximum character length accepted for a user message. */
const MAX_MESSAGE_LENGTH = 500;

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private normalizer = inject(ResponseNormalizerService);
  private webhookMode = inject(WebhookModeService);

  sendMessage(
    message: string,
    history: { role: ChatRole; content: string }[],
  ): Observable<AgentResponse> {
    // SECURITY: sanitize user input before forwarding to the AI node in n8n.
    // This prevents prompt-injection attacks where a crafted message could
    // override the system prompt or exfiltrate data via the AI response.
    const body: AgentRequest = {
      message: this.sanitizeMessage(message),
      history,
    };
    return this.http
      .post<unknown>(this.webhookMode.webhookUrl(), body)
      .pipe(map((raw) => this.normalizer.normalize(raw)));
  }

  confirmAction(action: VpsAction, vpsId: string | null): Observable<AgentResponse> {
    // confirmAction uses a fixed internal message — no user-supplied text here,
    // so the only sanitization needed is for the vpsId (no-op if null).
    const safeVpsId = vpsId ? this.sanitizeMessage(vpsId) : null;
    return this.http
      .post<unknown>(this.webhookMode.webhookUrl(), {
        message: `CONFIRMED: ejecutar ${action} en VPS ${safeVpsId}`,
        history: [],
      })
      .pipe(map((raw) => this.normalizer.normalize(raw)));
  }

  /**
   * Sanitizes a user-supplied string before it is sent to the AI node.
   *
   * SECURITY — what this prevents:
   *  - Prompt injection: stripping sequences like "Ignore previous instructions"
   *    embedded in control characters or excessive whitespace.
   *  - Log pollution: removes ASCII control chars that could corrupt structured
   *    log entries in n8n.
   *  - Denial-of-service via oversized payloads: hard-truncates at MAX_MESSAGE_LENGTH.
   *
   * What this does NOT do (and does not need to):
   *  - HTML/XSS escaping — the message never goes into innerHTML.
   *  - SQL injection prevention — there is no database involved.
   */
  sanitizeMessage(raw: string): string {
    return raw
      .trim()
      // Remove ASCII control characters (0x00–0x1F) except tab (0x09) and LF (0x0A)
      .replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '')
      // Collapse sequences of 3+ newlines into a single newline
      .replace(/\n{3,}/g, '\n')
      // Collapse sequences of 3+ spaces into a single space
      .replace(/ {3,}/g, ' ')
      // Hard limit — truncate to MAX_MESSAGE_LENGTH characters
      .slice(0, MAX_MESSAGE_LENGTH);
  }
}
