adapters Package Architecture

Overview
- Purpose: External integration adapters (LLM, MCP, IO).
- Responsibilities:
  - Provide thin wrappers over external services.
  - Normalize inputs/outputs for tools.

Modules
- llm: LLM provider adapter interface.
- mcp: MCP client adapter.
- io: Filesystem/network adapter layer.

Key Interfaces
- LLMAdapter.call(prompt)
- MCPClient.request(method, params)

Data Flow
- Tools call adapters; adapters return normalized results.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Keep adapters minimal and swappable.

Testing Notes
- Mocked adapter tests; no live network.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
