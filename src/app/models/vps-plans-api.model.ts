/** DTO crudo de la API de planes de CubePath — GET /vps/plans */

export interface VpsPlanItemDto {
  plan_name: string;
  ram: number;
  cpu: number;
  storage: number;
  bandwidth: number;
  price_per_hour: string;
  status: number;
}

export interface VpsPlanClusterDto {
  cluster_name: string;
  type: 'shared' | 'dedicated';
  plans: VpsPlanItemDto[];
}

export interface VpsPlanLocationDto {
  location_name: string;
  description: string;
  clusters: VpsPlanClusterDto[];
}

export interface VpsPlansApiResponse {
  locations: VpsPlanLocationDto[];
}
