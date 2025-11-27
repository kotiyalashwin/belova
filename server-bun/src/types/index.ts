export interface WebSocketMessage {
  e: 'started' | 'thinking' | 'file_creating' | 'file_created' | 'command' | 'command_failed' | 'command_error' | 'tool_error' | 'error';
  message?: string;
  error?: string;
  exit_code?: number;
  tool?: string;
}

export interface ChatPayload {
  prompt: string;
}

export interface ChatResponse {
  status: 'success' | 'error';
  project_id: string;
  file_count?: number;
  files?: string[];
  sandbox_id?: string;
  sandbox_active: boolean;
  error?: string;
}

export interface FileEntry {
  file_path: string;
  content: string;
}

export interface ProjectContext {
  semantic: string;
  procedural: string;
  episodic: string;
  code_map: Record<string, string>;
  structue: string[];
}

export interface ToolCall {
  name: string;
  args: Record<string, any>;
  id: string;
}

export interface AgentState {
  messages: any[];
  iteration_count: number;
}

export interface SandboxCommandResult {
  stdout: string;
  stderr: string;
  exit_code: number;
}

import { WebSocket as WSWebSocket } from 'ws';

export interface ExtendedWebSocket extends WSWebSocket {
  project_id?: string;
  isAlive?: boolean;
}

export interface AgentService {
  get_sandbox(project_id: string): Promise<any>;
  close_sandbox(project_id: string): Promise<void>;
  exec_in_sandbox(tool_name: string, tool_args: Record<string, any>, sandbox: any, socket?: ExtendedWebSocket): Promise<string>;
  handle_context_tool(tool_name: string, args: Record<string, any>, project_id: string, file_store: FileEntry[]): Promise<string | null>;
  run_agent_stream(prompt: string, project_id: string, socket?: ExtendedWebSocket): Promise<void>;
  sandboxes: Map<string, any>;
}


export type FileNode = {
    file_path: string,
    content: string
}
