router Package Architecture

Overview
- Purpose: Route tasks to skills, planners, and tool policies.
- Responsibilities:
  - Classify tasks and choose skill/planner.
  - Apply routing rules and overrides.

Modules
- rule-router: Static routing via rules and tags.
- model-router: Model-assisted routing when enabled.
- hybrid-router: Rules first, model fallback.

Key Interfaces
- Router.route(task) -> RouteDecision

Data Flow
- Input task -> features -> route decision -> core.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Keep routing deterministic when possible.

Testing Notes
- Rule coverage tests for routing decisions.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
