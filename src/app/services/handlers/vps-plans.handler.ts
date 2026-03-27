import { Injectable } from '@angular/core';
import { AgentResponse, VpsAction, isVpsPlansApi, mapVpsPlansApiToPlans, VpsPlansApiResponse } from '../../models';
import { ActionHandler } from './action-handler.token';

@Injectable()
export class VpsPlansHandler implements ActionHandler {
  canHandle(data: unknown): boolean {
    return isVpsPlansApi(data);
  }

  handle(data: unknown): AgentResponse {
    const raw = (Array.isArray(data) ? data[0] : data) as VpsPlansApiResponse;
    const plans = mapVpsPlansApiToPlans(raw);
    return {
      action: VpsAction.VPS_PLANS,
      vps_id: null,
      vps_name: null,
      confirm_required: false,
      user_message: `Planes disponibles en ${plans.locations.length} ubicación(es).`,
      plansData: plans,
    };
  }
}
