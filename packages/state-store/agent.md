state-store Package Architecture

Overview
- Purpose: In-memory state store for checkpoints and events.
- Responsibilities:
  - Persist checkpoints for a session.
  - Append events for replay or inspection.
  - Load a session's checkpoint and event list.

Key Exports
- InMemoryStateStore

Data Flow
- saveCheckpoint/appendEvent -> Map storage -> loadSession.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- In-memory only; storage is append-only per session.
- Empty sessions return empty event arrays.

Testing Notes
- Unit tests cover checkpoint and event persistence.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
