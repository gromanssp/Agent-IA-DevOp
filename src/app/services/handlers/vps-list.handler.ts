import { Injectable } from '@angular/core';
import { AgentResponse, VpsAction, isVpsApiList, mapVpsApiToInfo, VpsApiItem } from '../../models';
import { ActionHandler } from './action-handler.token';

@Injectable()
export class VpsListHandler implements ActionHandler {
  canHandle(data: unknown): boolean {
    return isVpsApiList(data);
  }

  handle(data: unknown): AgentResponse {
    const vpsList = (data as VpsApiItem[]).map(mapVpsApiToInfo);
    return {
      action: VpsAction.LIST_VPS,
      vps_id: null,
      vps_name: null,
      confirm_required: false,
      user_message: `Se encontraron ${vpsList.length} servidor(es) VPS.`,
      vpsData: vpsList,
    };
  }
}
