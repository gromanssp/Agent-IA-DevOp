import { VpsStatus } from './enums';

/** Modelo de dominio de un VPS, mapeado desde la API */
export interface VpsInfo {
  id: string;
  name: string;
  hostname: string;
  status: VpsStatus;
  ip: string;
  plan: string;
  location: string;
  os: string;
  cpu: string;
  ram: string;
  disk: string;
  bandwidth: string;
  project: string;
}
