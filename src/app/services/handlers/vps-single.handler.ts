import { Injectable } from '@angular/core';
import { AgentResponse, VpsAction, isVpsApiItem, mapVpsApiToInfo, VpsApiItem } from '../../models';
import { ActionHandler } from './action-handler.token';

@Injectable()
export class VpsSingleHandler implements ActionHandler {
  canHandle(data: unknown): boolean {
    return isVpsApiItem(data);
  }

  handle(data: unknown): AgentResponse {
    const vps = mapVpsApiToInfo(data as VpsApiItem);
    return {
      action: VpsAction.VPS_PLANS,
      vps_id: vps.id,
      vps_name: vps.name,
      confirm_required: false,
      user_message: `VPS "${vps.name}" — ${vps.status}`,
      vpsData: [vps],
    };
  }
}
