import { Injectable } from '@angular/core';
import { AgentResponse, VpsAction, isVpsMetricsApi, mapVpsMetricsApiToMetrics, VpsMetricsApiResponse } from '../../models';
import { ActionHandler } from './action-handler.token';

@Injectable()
export class VpsMetricsHandler implements ActionHandler {
  canHandle(data: unknown): boolean {
    return isVpsMetricsApi(data);
  }

  handle(data: unknown): AgentResponse {
    const raw = (Array.isArray(data) ? data[0] : data) as VpsMetricsApiResponse;
    const vpsId = (raw as unknown as Record<string, unknown>)['vps_id'] as string ?? 'unknown';
    const metrics = mapVpsMetricsApiToMetrics(raw, vpsId);
    return {
      action: VpsAction.METRICS,
      vps_id: vpsId,
      vps_name: null,
      confirm_required: false,
      user_message: `Metricas del VPS ${vpsId} (${metrics.timeRange}).`,
      metricsData: metrics,
    };
  }
}
