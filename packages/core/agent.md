core Package Architecture

Overview
- Purpose: Agent runtime and lifecycle orchestration.
- Responsibilities:
  - Coordinate router, planner, context builder, tools, memory, and state store.
  - Emit structured AgentEvent streams and persist events to StateStore.
  - Provide plugin hooks for logging, metrics, and instrumentation.

Modules
- src/index.ts: Agent class, createAgent, defaults.
- src/hooks.ts: hook types and AsyncSeriesHook wrapper.
- src/plugins.ts: logging/metrics plugin factories.

Key Interfaces
- Agent.run(input, sessionId?) -> Promise<AgentEvent[]>
- createAgent(options)
- AgentOptions, AgentLlmOptions
- AgentPlugin and hook types
- createLoggingPlugin(), createMetricsPlugin()

LLM Integration
- AgentLlmOptions includes apiKey, model, and optional request overrides.
- Prompts are assembled from ContextEnvelope into OpenAI chat messages.

Data Flow
- Input -> onRunStart -> memory.addShortTerm -> router.route -> emit thought.
- Context builder -> planner -> saveCheckpoint.
- Step loop:
  - tool: emit action -> toolRunner.run -> emit observation/error.
  - respond: generate text (LLM or echo) -> emit result.
- onRunEnd fires with error if any exception occurs.

Dependencies
- Internal: @tansui/types, @tansui/share, @tansui/router, @tansui/planner, @tansui/context, @tansui/tools, @tansui/memory, @tansui/rag, @tansui/state-store, @tansui/logging, @tansui/perf
- External: tapable

Design Decisions
- Defaults are in-memory to keep startup simple; production use should inject persistent stores.
- Plugins are selected by name; user-provided plugins override built-ins with the same name.
- Hook handlers should be defensive; thrown errors abort the run and surface as error events.

Testing Notes
- Unit tests verify event order, plugin hook invocation, tool hooks, and LLM request construction.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
