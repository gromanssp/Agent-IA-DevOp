export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  loading?: boolean;
  action?: N8nResponse;
  vpsData?: VpsInfo | VpsInfo[];
  confirmPending?: boolean;
}

export interface N8nRequest {
  message: string;
  history: { role: string; content: string }[];
}

export interface N8nResponse {
  action: 'list_vps' | 'get_vps' | 'reboot' | 'power_off' | 'power_on' | 'create' | 'status' | 'delete' | 'unknown';
  vps_id: string | null;
  vps_name: string | null;
  confirm_required: boolean;
  user_message: string;
}

export interface VpsInfo {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'restarting' | 'creating' | 'error';
  ip: string;
  plan: string;
  location: string;
  cpu?: string;
  ram?: string;
  disk?: string;
}
