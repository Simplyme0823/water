tools Package Architecture

Overview
- Purpose: Tool registry and default execution runner.
- Responsibilities:
  - Register tools by name and expose lookup/list operations.
  - Execute ToolCall instances and return ToolResult values.

Key Exports
- ToolRegistry
- DefaultToolRunner

Data Flow
- Core -> ToolRunner.run(call, ctx) -> ToolSpec.execute() -> ToolResult.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- Keep the runner minimal; callers handle retries and policy.
- Missing tools return a non-throwing error ToolResult.

Testing Notes
- Unit tests cover registry behavior and tool execution paths.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
