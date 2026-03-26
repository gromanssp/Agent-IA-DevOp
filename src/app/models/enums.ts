export enum VpsAction {
  LIST_VPS = 'list_vps',
  GET_VPS = 'get_vps',
  REBOOT = 'reboot',
  POWER_OFF = 'power_off',
  POWER_ON = 'power_on',
  CREATE = 'create',
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

export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}
