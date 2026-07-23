export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DeviceState {
  stepsCount: number;
  goal: number;
  calories: number;
  distance: number;
  isSynced: boolean;
  themeMode: 'light' | 'dark';
  isSyncing: boolean;
  accountType?: 'personal' | 'business' | null;
  userEmail?: string;
}

export interface FolderMetadata {
  title: string;
  description: string;
  purpose: string;
  scalabilityBenefit: string;
}
