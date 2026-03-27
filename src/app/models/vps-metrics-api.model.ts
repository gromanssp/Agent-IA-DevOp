/** DTO crudo de la API de metricas de CubePath — GET /vps/{vps_id}/metrics */

/** Cada punto de metrica llega como tupla [unix_timestamp, value] */
export type VpsMetricTuple = [number, number];

export interface VpsMetricsApiData {
  cpu_usage: VpsMetricTuple[];
  memory_usage: VpsMetricTuple[];
  disk_read_usage: VpsMetricTuple[];
  disk_write_usage: VpsMetricTuple[];
  network_receive_usage: VpsMetricTuple[];
  network_transmit_usage: VpsMetricTuple[];
}

export interface VpsMetricsApiResponse {
  start: number;
  end: number;
  metrics: VpsMetricsApiData;
}
