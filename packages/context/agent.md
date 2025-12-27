context Package Architecture

Overview
- Purpose: Build the ContextEnvelope that feeds planning and LLM calls.
- Responsibilities:
  - Collect short-term and long-term memory.
  - Optionally retrieve evidence via a RagClient.
  - Attach system prompts and the current input.

Key Exports
- DefaultContextBuilder

Data Flow
- Input + sessionId -> memory + rag -> ContextEnvelope.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- Long-term memory entries are flattened as "key: value" strings.
- RAG is optional; missing clients simply return no evidence.

Testing Notes
- Unit tests cover combined memory and RAG evidence output.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
