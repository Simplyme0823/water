rag Package Architecture

Overview
- Purpose: Retrieval pipeline as a pluggable tool.
- Responsibilities:
  - Retrieve evidence from indexes.
  - Rerank and compress evidence packs.

Modules
- retriever: Query -> candidate retrieval.
- reranker: Score and select evidence.
- compressor: Compress evidence into bounded pack.
- attribution: Track sources for audit.

Key Interfaces
- retrieve(request) -> EvidencePack

Data Flow
- Context builder or planner calls RAG tool; results feed context.

Dependencies
- Internal: @tansui/types, @tansui/share, @tansui/adapters
- External: (none)

Design Decisions
- RAG is optional; query generation lives above this layer.

Testing Notes
- Evidence packing and rerank tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
