planner Package Architecture

Overview
- Purpose: Generate and manage task plans.
- Responsibilities:
  - Create plan steps and update after observations.
  - Support multiple planning strategies.

Modules
- react: Step-by-step action planning.
- plan-execute: Plan first, then execute.
- tree: Explore multiple branches when needed.

Key Interfaces
- Planner.plan(state) -> Plan
- Planner.update(state, obs)

Data Flow
- State -> planner -> plan -> core loop.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Strategy is pluggable and selected by router.

Testing Notes
- Plan generation and update tests per strategy.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
