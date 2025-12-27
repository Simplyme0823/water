types Package Architecture

Overview
- Purpose: Shared domain types and interfaces for all packages.
- Responsibilities:
  - Define agent events, tools, planning, routing, context, and storage contracts.
  - Keep API boundaries stable between packages.

Key Exports
- AgentEvent, AgentEventType
- ToolSpec, ToolCall, ToolResult, ToolRunner, ToolContext
- Plan, PlanStep, Planner, PlannerState
- RouteDecision, Router
- ContextEnvelope, ContextBuilder
- MemoryStore, StateStore
- EvidenceItem, EvidencePack, RagClient
- Logger, Metrics, Span, Id

Data Flow
- No runtime data flow; types only.

Dependencies
- Internal: (none)
- External: (none)

Design Decisions
- Keep types serializable and minimal.
- Prefer additive changes to preserve compatibility across packages.

Testing Notes
- Type-only validation via tsc; no runtime tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
