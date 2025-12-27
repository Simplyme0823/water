import type { AgentEvent, StateStore } from "@tansui/types";

export class InMemoryStateStore implements StateStore {
  private readonly checkpoints = new Map<string, unknown>();
  private readonly events = new Map<string, AgentEvent[]>();

  async saveCheckpoint(sessionId: string, state: unknown): Promise<void> {
    this.checkpoints.set(sessionId, state);
  }

  async appendEvent(sessionId: string, event: AgentEvent): Promise<void> {
    const list = this.events.get(sessionId) ?? [];
    list.push(event);
    this.events.set(sessionId, list);
  }

  async loadSession(sessionId: string): Promise<{ checkpoint?: unknown; events: AgentEvent[] }> {
    return {
      checkpoint: this.checkpoints.get(sessionId),
      events: this.events.get(sessionId) ?? [],
    };
  }
}
