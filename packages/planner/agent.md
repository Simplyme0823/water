planner Package Architecture

Overview
- Purpose: Produce a simple plan for the agent runtime.
- Responsibilities:
  - Emit a single-step plan for the current input.
  - Prefer the "respond" tool when it is available.

Key Exports
- SimplePlanner

Data Flow
- PlannerState -> SimplePlanner.plan() -> Plan with one step.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- If the "respond" tool exists, plan a tool step; otherwise emit a respond step.
- Keep planning synchronous and deterministic for now.

Testing Notes
- Unit tests cover tool and non-tool planning paths.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
