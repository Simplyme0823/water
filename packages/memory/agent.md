memory Package Architecture

Overview
- Purpose: In-memory memory store implementation.
- Responsibilities:
  - Store short-term session memory as an ordered list.
  - Store long-term session memory as key/value pairs.

Key Exports
- InMemoryMemoryStore

Data Flow
- addShortTerm/putLongTerm -> Map storage -> getShortTerm/getLongTerm.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- In-memory only; callers should inject persistent stores for production.
- Return empty collections for unknown sessions.

Testing Notes
- Unit tests verify short-term and long-term storage behavior.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
