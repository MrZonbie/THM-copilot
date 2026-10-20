export interface RoomInfo {
  name: string;
  description: string;
  objective: string;
  ip?: string;
  url?: string;
  additionalInfo?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    commandExecuted?: string;
    terminalOutput?: string;
    note?: string;
  };
}

export interface Evidence {
  id: string;
  description: string;
  status: 'confirmed' | 'hypothesis';
  source?: string;
}

export interface Session {
  id: string;
  title: string;
  roomInfo: RoomInfo;
  messages: Message[];
  evidence: Evidence[];
  createdAt: number;
  updatedAt: number;
}
