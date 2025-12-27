Engineering Practices (Best Practices)

## Scope
- Applies to all packages under `packages/*` and apps under `apps/*`.

## Code Quality
- Keep modules small and single-purpose.
- Prefer explicit interfaces and clear data contracts.
- Avoid hidden side effects; keep functions pure where possible.
- Add code comments where the intent or flow is non-obvious.
- Keep architecture documentation up to date; update `agent.md` whenever architecture changes.
- Code must pass ESLint checks before merge.

## Testing
- TDD-first; write tests before implementation changes.
- Keep unit tests fast and deterministic.
- Use regression suites for cross-package behavior.

## Dependencies
- Prefer mature community npm packages for common utilities.
- Pin exact versions; avoid `^` ranges.
- Minimize transitive dependencies in core packages.

## Architecture Discipline
- UI must be decoupled from core runtime logic.
- All side effects go through tools/adapters.
- Event-driven outputs are the default integration path.

## Operational Concerns
- Add structured logging to all runtime boundaries.
- Track performance metrics for hot paths.
- Persist session/task state for replay and recovery.
