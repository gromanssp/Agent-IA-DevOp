/** Modelo de metricas de un VPS — GET /vps/{vps_id}/metrics */

export interface VpsMetricPoint {
  timestamp: string;
  value: number;
}

export interface VpsMetrics {
  vpsId: string;
  timeRange: string;
  cpu: VpsMetricPoint[];
  memory: VpsMetricPoint[];
  diskRead: VpsMetricPoint[];
  diskWrite: VpsMetricPoint[];
  networkIn: VpsMetricPoint[];
  networkOut: VpsMetricPoint[];
}
