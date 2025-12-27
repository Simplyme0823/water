eval Package Architecture

Overview
- Purpose: Evaluation harness and regression testing.
- Responsibilities:
  - Run golden test suites and score outputs.
  - Report metrics for regressions.

Modules
- runner: EvalRunner executes suites.
- suite: Regression suite definitions.
- metrics: Scoring and aggregation.

Key Interfaces
- runSuite(suite) -> Report

Data Flow
- Eval runner drives core and collects results.

Dependencies
- Internal: @tansui/types, @tansui/core, @tansui/share
- External: (none)

Design Decisions
- Small, stable suites per skill.

Testing Notes
- Deterministic evaluation tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
