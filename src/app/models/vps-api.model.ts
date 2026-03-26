/** DTOs que representan la respuesta cruda de la API de CubePath */

import { IpType } from './enums';

export interface VpsFloatingIpDto {
  address: string;
  netmask: string;
  type: IpType;
  protection_type: string;
  is_primary: boolean;
}

export interface VpsPlanDto {
  plan_name: string;
  ram: number;
  cpu: number;
  storage: number;
  bandwidth: number;
  price_per_hour: number;
}

export interface VpsTemplateDto {
  template_name: string;
  os_name: string;
}

export interface VpsLocationDto {
  description: string;
  location_name: string;
}

export interface VpsProjectDto {
  id: number;
  name: string;
  description: string;
}

export interface VpsApiItem {
  id: number;
  label: string;
  name: string;
  hostname: string;
  status: string;
  user: string;
  plan: VpsPlanDto;
  template: VpsTemplateDto;
  floating_ips: {
    list: VpsFloatingIpDto[];
    price_per_hour: number;
  };
  ssh_keys: string[];
  location: VpsLocationDto;
  network: unknown;
  firewall_groups: unknown[];
  firewall_enabled: boolean;
  project: VpsProjectDto;
}
