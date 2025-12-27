eval Package Architecture

Overview
- Purpose: Minimal evaluation harness types and runner.
- Responsibilities:
  - Define eval cases, suites, and reports.
  - Provide a basic runner that summarizes suites.

Key Exports
- EvalCase
- EvalSuite
- EvalReport
- EvalRunner

Data Flow
- EvalRunner.runSuite() -> EvalReport summary.

Dependencies
- Internal: (none)
- External: (none)

Design Decisions
- Keep the runner minimal and deterministic; scoring logic can be layered later.

Testing Notes
- Unit tests verify report totals.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
