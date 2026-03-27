export enum VpsAction {
  LIST_VPS = 'list_vps',
  VPS_PLANS = 'vps_plans',
  REBOOT = 'reboot',
  POWER_OFF = 'power_off',
  POWER_ON = 'power_on',
  METRICS = 'metrics',
  STATUS = 'status',
  DELETE = 'delete',
  UNKNOWN = 'unknown',
}

export enum VpsStatus {
  ACTIVE = 'active',
  RUNNING = 'running',
  STOPPED = 'stopped',
  RESTARTING = 'restarting',
  CREATING = 'creating',
  ERROR = 'error',
}

export enum IpType {
  IPV4 = 'IPv4',
  IPV6 = 'IPv6',
}

export enum BadgeVariant {
  PRIMARY = 'primary',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
}

export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}
