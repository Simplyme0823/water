ui-bridge Package Architecture

Overview
- Purpose: Event protocol and transports for UI decoupling.
- Responsibilities:
  - Serialize events and stream to clients.
  - Provide adapters for SSE/WS/IPC.

Modules
- protocol: Event schema and versioning.
- serializer: JSON encoding and framing.
- transports: SSE/WS/IPC adapters.

Key Interfaces
- publish(event)
- subscribe(handler)

Data Flow
- Core emits events -> bridge -> UI clients.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Transport-agnostic event stream.

Testing Notes
- Protocol encoding tests; adapter mocks.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
