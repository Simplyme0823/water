ui-bridge Package Architecture

Overview
- Purpose: Lightweight event bus for UI subscribers.
- Responsibilities:
  - Allow handlers to subscribe/unsubscribe to AgentEvent streams.
  - Publish events to all active subscribers.

Key Exports
- EventBus
- EventHandler

Data Flow
- publish(event) -> notify all subscribed handlers.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- In-memory, fire-and-forget pub/sub.
- StateStore should be used for replay instead of the bus.

Testing Notes
- Unit tests cover subscribe/unsubscribe and publish behavior.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
