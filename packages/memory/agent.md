memory Package Architecture

Overview
- Purpose: Short and long-term memory management.
- Responsibilities:
  - Store short-term conversation window.
  - Persist long-term profile and facts.
  - Support vector and graph retrieval.

Modules
- short-term: Recent conversation buffer with summarization.
- long-term: Structured profile and facts.
- vector: Vector memory store interface.
- graph: Graph memory store interface.
- hybrid: Hybrid retrieval across stores.

Key Interfaces
- Memory.get/put/search

Data Flow
- Context builder reads memory; updates written after tasks.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Hybrid retrieval for recall + relation reasoning.

Testing Notes
- Retrieval and merge tests across stores.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
