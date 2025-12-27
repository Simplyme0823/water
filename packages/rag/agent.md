rag Package Architecture

Overview
- Purpose: RAG client entry point with an empty default implementation.
- Responsibilities:
  - Provide a no-op RagClient that returns no evidence.
  - Act as a placeholder for future retrieval integrations.

Key Exports
- EmptyRagClient

Data Flow
- retrieve(query) -> EvidencePack with empty items.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- Null-object implementation avoids conditional checks in the core runtime.

Testing Notes
- Unit test verifies empty evidence output.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
