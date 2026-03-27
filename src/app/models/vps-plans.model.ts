/** Modelo de dominio para planes de VPS */

export interface VpsPlan {
  name: string;
  ram: number;       // GB
  cpu: number;
  storage: number;   // GB
  bandwidth: number; // TB
  pricePerHour: number;
  pricePerMonth: number;
  available: boolean;
}

export interface VpsPlanCluster {
  name: string;
  type: 'shared' | 'dedicated';
  plans: VpsPlan[];
}

export interface VpsPlanLocation {
  name: string;
  description: string;
  clusters: VpsPlanCluster[];
}

export interface VpsPlans {
  locations: VpsPlanLocation[];
}
