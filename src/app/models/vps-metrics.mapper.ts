import { VpsMetricTuple, VpsMetricsApiResponse } from './vps-metrics-api.model';
import { VpsMetricPoint, VpsMetrics } from './vps-metrics.model';

function toPoints(tuples: VpsMetricTuple[] = []): VpsMetricPoint[] {
  return tuples.map(([ts, value]) => ({
    timestamp: new Date(ts * 1000).toISOString(),
    value,
  }));
}

export function mapVpsMetricsApiToMetrics(
  raw: VpsMetricsApiResponse,
  vpsId: string,
  timeRange: string = '1h',
): VpsMetrics {
  return {
    vpsId,
    timeRange,
    cpu: toPoints(raw.metrics?.cpu_usage),
    memory: toPoints(raw.metrics?.memory_usage),
    diskRead: toPoints(raw.metrics?.disk_read_usage),
    diskWrite: toPoints(raw.metrics?.disk_write_usage),
    networkIn: toPoints(raw.metrics?.network_receive_usage),
    networkOut: toPoints(raw.metrics?.network_transmit_usage),
  };
}

export function isVpsMetricsApi(item: unknown): item is VpsMetricsApiResponse {
  const obj = Array.isArray(item) && item.length === 1 ? item[0] : item;
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const record = obj as Record<string, unknown>;
  return 'metrics' in record && typeof record['metrics'] === 'object' && record['metrics'] !== null;
}
