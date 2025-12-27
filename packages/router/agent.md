router Package Architecture

Overview
- Purpose: Provide a routing decision for planner selection.
- Responsibilities:
  - Return a RouteDecision with the chosen planner name.
  - Keep routing deterministic by default.

Key Exports
- DefaultRouter

Data Flow
- Input -> DefaultRouter.route() -> RouteDecision.

Dependencies
- Internal: @tansui/types
- External: (none)

Design Decisions
- DefaultRouter uses a constructor argument to set the planner name.
- No model-based routing is implemented yet.

Testing Notes
- Unit tests cover the default planner and override behavior.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
