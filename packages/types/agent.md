types Package Architecture

Overview
- Purpose: Shared type definitions used across all packages.
- Responsibilities:
  - Define core domain types (events, tools, memory, plans).
  - Provide stable contracts for cross-package APIs.

Modules
- domain-types: AgentEvent, ToolSpec, ToolResult, MemoryRecord, Plan.
- protocols: Event wire shapes and serialization-safe payloads.

Key Interfaces
- AgentEvent
- ToolSpec<TInput, TOutput>
- ToolResult
- MemoryRecord
- Plan

Data Flow
- Pure type export only; no runtime flow.

Dependencies
- Internal: (none)
- External: (none)

Design Decisions
- No runtime code; types only to keep dependencies minimal.
- Prefer additive changes for compatibility.

Testing Notes
- Type-only validation via tsc; no runtime tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
