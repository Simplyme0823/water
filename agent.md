Agent Engineering Summary

## Goal
- Build a Node-based, UI-agnostic agent core that can be reused by Electron/Web/CLI via adapters.
- Keep execution logic decoupled from UI; UI only renders structured events.

## ASCII Architecture Diagram (Markdown)
```
+----------------------------------------------------------------------------------------------+
|                                         UI Layer                                             |
|  Web UI  |  Electron UI  |  CLI                                                             |
+----------------------------------------------------------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------------------+
|                                       UI Bridge                                              |
|  Event Protocol  |  Transports (SSE / WS / IPC)                                              |
+----------------------------------------------------------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------------------+
|                                         Agent Core                                           |
|  Router  |  Planner  |  Context Builder  |  Runtime                                           |
+----------------------------------------------------------------------------------------------+
        |                |                   |                      |            |
        |                |                   |                      |            |
        v                v                v                   v                      v            v           v           v
+----------------+  +----------------+  +----------------+  +----------------+   +--------------+  +--------------+  +--------------+  +--------------+
|   Skill System |  |     Tooling    |  |  State Store   |  |     Memory     |   |     RAG       |  |  Evaluator   |  |   Logging    |  | Performance  |
|  Skills/Config |  | Registry/Tools |  | Session/Tasks  |  | Short/Long-term|   | Retrieve/Rerank|  | Metrics/Suites|  | Logs/Trace  |  | Profiles    |
+----------------+  +----------------+  +----------------+  +----------------+   +--------------+  +--------------+  +--------------+  +--------------+
                      |                    |                     |                   |                |               |               |
                      v                    v                     v                   v                v               v               v
                 +-----------+       +--------------+       +-----------+        +-----------+     +-----------+   +-----------+   +-----------+
                 | Adapters  |       | Checkpoints  |       | Vector DB |        | Evidence  |     | Reports   |   | Telemetry |   | Counters  |
                 | MCP/LLM/IO|       | Event Logs   |       | Graph DB  |        | Pack      |     |           |   |           |   |           |
                 +-----------+       +--------------+       +-----------+        +-----------+     +-----------+   +-----------+   +-----------+
```

## Core Principles
- Core runtime has no UI or platform dependencies.
- All side effects go through adapters/tools.
- Output is an event stream for traceability and UI decoupling.
- Skills package domain capabilities; tools are minimal executable units.

## Engineering Practices
- See `engineering-practices.md` for the full best-practices checklist.

## Architecture Overview
- Core Runtime: task state machine, execution loop (plan/act/observe/reflect), error recovery.
- Router: routes tasks to skills/tools/strategies; supports rule/model/hybrid routing.
- Planner: ReAct / Plan-and-Execute / Tree-search as pluggable strategies.
- Context Builder: assembles system prompt, user query, skills, tools, memory, RAG evidence, with token budget control.
- Tool Layer: registry, schema validation, permission/audit, retry/fallback.
- Plugin System: lifecycle hooks for run/plan/step/tool/event instrumentation and policy.
- UI Bridge: event protocol and transports (SSE/WS/IPC) for UI decoupling.
- State/Session Store: persist task state, checkpoints, and event logs for resume/replay.
- Memory: short-term + long-term; structured profile for stable user facts.
- RAG: retrieval pipeline as a pluggable tool; evidence compression and provenance.
- Logging: structured logs, trace IDs, tool/LLM call telemetry.
- Performance: latency/throughput metrics, profiling, and sampling export.
- Evaluator: small regression sets, metrics for tool success and evidence coverage.

## State and Session Persistence
- Persist: session metadata, task state, plan progress, tool calls, and event stream snapshots.
- Strategy: checkpoint + append-only event log for replay and recovery.
- Storage: pluggable backends (in-memory, file, DB/kv) with retention policies.
- Recovery: resume from last checkpoint; ensure idempotent tool calls when replaying.

## Skill Model
- Skill = domain package: prompts + tool set + RAG config + eval cases.
- Skills are injected at runtime by Router/Context Builder.
- Skills can be mandatory via routing rules or runtime validation.

## Tool Model
- Tool = minimal executable capability with strict I/O schema.
- Tools can be enforced by runtime policies (mandatory tool calls).
- RAG retrieval is implemented as a tool; usage policy sits in skill/planner.

## RAG and Memory Collaboration
- Memory -> RAG: use memory facts to enrich retrieval queries.
- RAG -> Memory: distilled high-value evidence can be written to long-term memory.
- Treat RAG as optional, pluggable tool; query generation is handled by planner/context builder.

## Hybrid Memory (Vector + Graph)
- Vector store: semantic similarity recall.
- Graph store: relation reasoning.
- Unified retrieval layer: vector recall -> graph expansion (or graph prefilter -> vector rerank).
- Merge, dedupe, rerank before context injection.

## Event-Driven Output (UI-Decoupled)
- Core emits: thought, action, observation, result, error.
- Adapters map events to Web (SSE/WS), Electron (IPC), CLI (stdout).

## Plugin System (Hooks)
- Plugins register via `AgentOptions.plugins` and subscribe to lifecycle hooks.
- Hooks run sequentially; hook failures do not stop the run.
- Hooks are implemented with tapable `AsyncSeriesHook` for deterministic ordering.
- Built-in helper plugins: `createLoggingPlugin`, `createMetricsPlugin` (from `@tansui/core`).
- Default plugins are registered for `logging` and `metrics`; provide a plugin with the same name to override or disable.
- Hook payloads share `{ input, sessionId, taskId }` plus:
  - `onRunEnd`: `error?` when the run fails.
  - `onPlanStart`: `context`, `tools`.
  - `onPlanEnd`: `plan`.
  - `onStepStart`: `step`.
  - `onStepEnd`: `step`, `outcome`, `toolResult?`.
  - `onToolStart`: `tool`.
  - `onToolEnd`: `tool`, `result`.
  - `onEvent`: `event`.
  - Errors are available via `onRunEnd.error` or `onEvent` with `type: "error"`.

Example:
```ts
import { createAgent, createLoggingPlugin, createMetricsPlugin } from "@tansui/core";
import { createConsoleLogger } from "@tansui/logging";
import { MetricsCollector } from "@tansui/perf";

const logger = createConsoleLogger();
const metrics = new MetricsCollector();

const agent = createAgent({
  plugins: [
    createLoggingPlugin(logger, { logEvents: true }),
    createMetricsPlugin(metrics, { prefix: "tansui." }),
  ],
});
```

## Minimal Interfaces (TypeScript-style)
- Agent.run(input, context, adapters) -> Promise<AgentEvent[]>
- Tool.execute(params, ctx) -> Promise<ToolResult>
- Memory.get/put/search
- Planner.plan(state) -> Plan
- Router.route(task) -> Skill/Strategy

## Packages
- @tansui/types: shared type definitions; all packages depend on this.
- @tansui/share: shared utilities and common helpers.
- @tansui/core: runtime + execution loop + plugin hooks
- @tansui/router: routing strategies
- @tansui/planner: planning strategies
- @tansui/context: context builder + budget control
- @tansui/tools: tool registry + schemas
- @tansui/adapters: external integrations (fs/net/llm/mcp)
- @tansui/state-store: session/task persistence, checkpoints, and replay
- @tansui/memory: memory interfaces + implementations
- @tansui/rag: retrieval tool(s) + evidence packer
- @tansui/ui-bridge: event protocol + serialization
- @tansui/eval: evaluation harness
- @tansui/logging: structured logs + tracing + telemetry
- @tansui/perf: performance metrics + profiling + exporters
