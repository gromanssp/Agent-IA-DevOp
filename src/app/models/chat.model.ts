import { ChatRole, VpsAction } from './enums';
import { VpsInfo } from './vps.model';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  loading?: boolean;
  action?: AgentResponse;
  vpsData?: VpsInfo[];
  confirmPending?: boolean;
}

export interface AgentRequest {
  message: string;
  history: { role: ChatRole; content: string }[];
}

export interface AgentResponse {
  action: VpsAction;
  vps_id: string | null;
  vps_name: string | null;
  confirm_required: boolean;
  user_message: string;
  vpsData?: VpsInfo[];
}
