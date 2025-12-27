core Package Architecture

Overview
- Purpose: Agent runtime and execution loop.
- Responsibilities:
  - Own the plan/act/observe/reflect loop.
  - Coordinate router, planner, tools, memory, and state store.
  - Emit event stream for UI and logging.

Modules
- runtime: AgentRuntime orchestrates a single run.
- loop: Execution loop driving plan and tool calls.
- events: EventEmitter for AgentEvent stream.
- hooks: Lifecycle hooks implemented with tapable.
- cancellation: Cancellation token and timeouts.
- error-policy: Retry and fallback rules.

Key Interfaces
- Agent.run(input, ctx) -> Promise<AgentEvent[]>
- AgentRuntime.start(task)
- ExecutionLoop.step(state)

LLM Integration
- Enable via `AgentOptions.llm` with OpenAI client options plus `model`.
- System prompts plus memory/evidence are sent as `system` messages; input is sent as `user`.
- LLM text replaces the respond step output in the `result` event.

Data Flow
- Input -> Router -> Planner -> ToolRunner -> Observation -> next step.
- Events emitted on each state transition.

Dependencies
- Internal: @tansui/types, @tansui/share, @tansui/router, @tansui/planner, @tansui/context, @tansui/tools, @tansui/memory, @tansui/state-store, @tansui/logging, @tansui/perf
- External: tapable

Design Decisions
- Event-driven output to keep UI decoupled.
- All side effects routed through tools/adapters.

Plugin System (Hooks)
- Plugins register via `AgentOptions.plugins` and subscribe to lifecycle hooks.
- Hooks run sequentially; hook failures do not stop the run.
- Hook implementation uses tapable `AsyncSeriesHook`.
- Default plugins are registered for `logging` and `metrics`; provide a plugin with the same name to override or disable.

Testing Notes
- Unit tests for state transitions; integration tests for loop flow.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
