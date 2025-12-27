import type { AgentEvent } from "@tansui/types";

export type EventHandler = (event: AgentEvent) => void;

export class EventBus {
  private readonly handlers = new Set<EventHandler>();

  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  publish(event: AgentEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}
