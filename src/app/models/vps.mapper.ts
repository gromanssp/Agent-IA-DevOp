import { IpType, VpsStatus } from './enums';
import { VpsApiItem } from './vps-api.model';
import { VpsInfo } from './vps.model';

export function mapVpsApiToInfo(raw: VpsApiItem): VpsInfo {
  const ipv4 = raw.floating_ips?.list?.find((ip) => ip.type === IpType.IPV4);

  return {
    id: String(raw.id),
    name: raw.name,
    hostname: raw.hostname,
    status: (raw.status as VpsStatus) ?? VpsStatus.ERROR,
    ip: ipv4?.address ?? 'N/A',
    plan: raw.plan?.plan_name ?? 'N/A',
    location: raw.location?.description ?? 'N/A',
    os: raw.template?.os_name ?? 'N/A',
    cpu: `${raw.plan?.cpu ?? 0} vCPU`,
    ram: `${raw.plan?.ram ?? 0} MB`,
    disk: `${raw.plan?.storage ?? 0} GB`,
    bandwidth: `${raw.plan?.bandwidth ?? 0} TB`,
    pricePerHour: raw.plan?.price_per_hour ?? 0,
    project: raw.project?.name ?? 'N/A',
  };
}

export function isVpsApiItem(item: unknown): item is VpsApiItem {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
  const obj = item as Record<string, unknown>;
  return 'hostname' in obj && 'floating_ips' in obj && 'plan' in obj;
}

export function isVpsApiList(data: unknown): data is VpsApiItem[] {
  return Array.isArray(data) && data.length > 0 && isVpsApiItem(data[0]);
}
