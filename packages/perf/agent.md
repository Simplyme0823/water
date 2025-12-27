perf Package Architecture

Overview
- Purpose: No-op metrics collector used by default plugins.
- Responsibilities:
  - Provide a Metrics implementation that is safe in all environments.
  - Return Span objects with an empty end() implementation.

Key Exports
- MetricsCollector

Data Flow
- Plugins call startSpan/count -> no-op implementations.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- Keep defaults lightweight; production builds can inject real metrics.

Testing Notes
- Unit tests assert that spans and counts are callable without errors.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
