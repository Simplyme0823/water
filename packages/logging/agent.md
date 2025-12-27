logging Package Architecture

Overview
- Purpose: Structured logging and tracing.
- Responsibilities:
  - Emit structured logs with trace ids.
  - Capture tool/LLM telemetry.

Modules
- logger: Logger interface with levels.
- trace: Trace context propagation.
- sinks: Console/file/remote sinks.

Key Interfaces
- log(level, msg, fields)
- withTrace(ctx)

Data Flow
- Core/tools emit logs -> sinks.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Structured logs over free-form strings.

Testing Notes
- Log formatting and trace propagation tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
