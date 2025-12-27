export interface LlmAdapter {
  complete(input: { prompt: string }): Promise<{ text: string }>;
}

export interface McpAdapter {
  request<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T>;
}

export interface IoAdapter {
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
}
