import { VpsPlansApiResponse, VpsPlanItemDto, VpsPlanClusterDto, VpsPlanLocationDto } from './vps-plans-api.model';
import { VpsPlan, VpsPlanCluster, VpsPlanLocation, VpsPlans } from './vps-plans.model';

function mapPlan(dto: VpsPlanItemDto): VpsPlan {
  const pricePerHour = parseFloat(dto.price_per_hour);
  return {
    name: dto.plan_name,
    ram: dto.ram / 1024,
    cpu: dto.cpu,
    storage: dto.storage,
    bandwidth: dto.bandwidth,
    pricePerHour,
    pricePerMonth: parseFloat((pricePerHour * 24 * 30).toFixed(2)),
    available: dto.status === 2,
  };
}

function mapCluster(dto: VpsPlanClusterDto): VpsPlanCluster {
  return {
    name: dto.cluster_name,
    type: dto.type,
    plans: dto.plans.map(mapPlan),
  };
}

function mapLocation(dto: VpsPlanLocationDto): VpsPlanLocation {
  return {
    name: dto.location_name,
    description: dto.description,
    clusters: dto.clusters.map(mapCluster),
  };
}

export function mapVpsPlansApiToPlans(raw: VpsPlansApiResponse): VpsPlans {
  return {
    locations: raw.locations.map(mapLocation),
  };
}

export function isVpsPlansApi(item: unknown): item is VpsPlansApiResponse {
  const obj = Array.isArray(item) && item.length === 1 ? item[0] : item;
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const record = obj as Record<string, unknown>;
  return 'locations' in record && Array.isArray(record['locations']);
}
