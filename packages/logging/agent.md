logging Package Architecture

Overview
- Purpose: Console-based logger implementation.
- Responsibilities:
  - Provide a Logger implementation for core plugins.
  - Normalize missing fields to empty objects for consistent logging.

Key Exports
- createConsoleLogger()

Data Flow
- Plugins call logger.info/error/debug -> console methods.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- Expose debug via console.debug; info/error map to console.log/error.

Testing Notes
- Unit tests verify console method usage.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
