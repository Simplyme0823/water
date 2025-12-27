state-store Package Architecture

Overview
- Purpose: Persist session and task state for resume/replay.
- Responsibilities:
  - Store checkpoints and append-only event logs.
  - Load and reconstruct sessions.

Modules
- store: StateStore interface with get/put/append.
- memory-store: In-memory store for local dev.
- file-store: File-based persistence for MVP.

Key Interfaces
- saveCheckpoint(sessionId, state)
- appendEvent(sessionId, event)
- loadSession(sessionId)

Data Flow
- Core writes events and checkpoints; store replays on resume.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Append-only event log for audit and recovery.

Testing Notes
- Round-trip persistence tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
