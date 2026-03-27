import { InjectionToken } from '@angular/core';
import { AgentResponse } from '../../models';

export interface ActionHandler {
  canHandle(data: unknown): boolean;
  handle(data: unknown): AgentResponse;
}

export const ACTION_HANDLERS = new InjectionToken<ActionHandler[]>('ACTION_HANDLERS');
