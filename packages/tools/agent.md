tools Package Architecture

Overview
- Purpose: Tool registry and execution framework.
- Responsibilities:
  - Register tools with schemas and policies.
  - Execute tools and normalize results.

Modules
- registry: ToolRegistry with lookup and metadata.
- runner: ToolRunner with retry/fallback.
- policy: Permission and rate policy checks.
- validation: Input validation and output shaping.

Key Interfaces
- Tool.execute(params, ctx) -> ToolResult

Data Flow
- Core -> ToolRunner -> Adapter -> Result -> Core.

Dependencies
- Internal: @tansui/types, @tansui/share, @tansui/adapters
- External: (none)

Design Decisions
- All side effects go through tools.

Testing Notes
- Registry and execution flow tests with mock adapters.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
