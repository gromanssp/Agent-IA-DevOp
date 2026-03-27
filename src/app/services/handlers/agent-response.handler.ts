import { Injectable } from '@angular/core';
import { AgentResponse, VpsAction } from '../../models';
import { ActionHandler } from './action-handler.token';

/** Fallback: maneja respuestas JSON del AI Agent de n8n con action/user_message */
@Injectable()
export class AgentResponseHandler implements ActionHandler {
  canHandle(_data: unknown): boolean {
    return true;
  }

  handle(data: unknown): AgentResponse {
    const obj = (Array.isArray(data) ? data[0] ?? {} : data ?? {}) as Record<string, unknown>;
    const action = (obj['action'] as string) || (obj['pending_action'] as string);
    return {
      action: (action as VpsAction) ?? VpsAction.UNKNOWN,
      vps_id: (obj['vps_id'] as string) ?? null,
      vps_name: (obj['vps_name'] as string) ?? null,
      confirm_required: obj['confirm_required'] === true || obj['confirm_required'] === 'true',
      user_message: (obj['user_message'] as string) || 'Respuesta recibida.',
    };
  }
}
