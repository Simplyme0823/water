context Package Architecture

Overview
- Purpose: Assemble model context with budgeting.
- Responsibilities:
  - Build prompt context from system, memory, skills, and evidence.
  - Apply token budgets and summarization.

Modules
- builder: ContextBuilder for assembling prompt payloads.
- budget: Token budget allocation and trimming.
- summarizer: Conversation and tool result summaries.
- evidence: Evidence pack integration.

Key Interfaces
- buildContext(input, state) -> ContextEnvelope

Data Flow
- Memory + RAG + skills -> context -> planner/tool calls.

Dependencies
- Internal: @tansui/types, @tansui/share, @tansui/memory, @tansui/rag
- External: (none)

Design Decisions
- Keep context builder deterministic and testable.

Testing Notes
- Budget trimming and context assembly tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
