adapters Package Architecture

Overview
- Purpose: Adapter interface definitions for external integrations.
- Responsibilities:
  - Define LLM, MCP, and IO adapter shapes.
  - Keep integration surfaces small and promise-based.

Key Exports
- LlmAdapter
- McpAdapter
- IoAdapter

Data Flow
- No runtime flow; interfaces are implemented by downstream packages.

Dependencies
- Internal: (none)
- External: (none)

Design Decisions
- Keep adapter contracts minimal and transport-agnostic.

Testing Notes
- Type-level tests verify interface shapes.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
