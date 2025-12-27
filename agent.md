Tansui Architecture Overview

## Goal
- Build a Node-based, UI-agnostic agent core that can be reused by Electron/Web/CLI via adapters.
- Keep execution logic decoupled from UI; UI renders structured events.

## Non-Goals (Current Scope)
- Production-grade skill marketplace, persistent RAG stores, or multi-tenant hosting.
- Advanced autonomy beyond the minimal plan/act/respond loop.

## ASCII Architecture Diagram (Markdown)
```
+----------------------------------------------------------------------------------+
|                                      UI Layer                                    |
|  Web UI  |  Electron UI  |  CLI                                                  |
+----------------------------------------------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------+
|                                    UI Bridge                                    |
|  Event Protocol  |  Transports (SSE / WS / IPC)                                  |
+----------------------------------------------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------+
|                                    Agent Core                                    |
|  Router  |  Planner  |  Context Builder  |  Runtime                               |
+----------------------------------------------------------------------------------+
        |                |                   |                      |        |
        |                |                   |                      |        |
        v                v                   v                      v        v
+----------------+  +--------------+  +--------------+   +----------------+  +-------------+
|     Tools      |  |    Memory    |  |     RAG      |   |   State Store  |  |   Plugins   |
| Registry/Runner|  | Short/Long   |  |   Client     |   | Checkpoints    |  | Log/Metrics |
+----------------+  +--------------+  +--------------+   +----------------+  +-------------+
                      |
                      v
                 +-----------------------+
                 | Adapters (IO/LLM/MCP) |
                 +-----------------------+
```

## Runtime Flow (Current)
- UI/CLI provides input.
- Core routes input, builds context, plans steps, and executes the plan.
- Tool steps execute via ToolRunner; respond steps emit text (LLM-backed if configured).
- Events are emitted to subscribers and persisted via StateStore.
- Plugins observe lifecycle hooks for logging and metrics.

## Package Map
- `packages/types`: shared domain types and interfaces.
- `packages/share`: shared helpers and OpenAI streaming utilities.
- `packages/tools`: tool registry and default runner.
- `packages/router`: simple routing decision.
- `packages/planner`: simple planner implementation.
- `packages/context`: default context builder.
- `packages/memory`: in-memory memory store.
- `packages/rag`: empty RAG client implementation.
- `packages/state-store`: in-memory checkpoint/event store.
- `packages/ui-bridge`: event bus for UI subscribers.
- `packages/logging`: console logger implementation.
- `packages/perf`: no-op metrics collector.
- `packages/eval`: minimal evaluation harness types/runner.
- `packages/adapters`: adapter interface definitions.
- `apps/cli`: CLI entrypoint and Ink-based interactive UI.

## Current State vs Planned
- Implemented today: core runtime, in-memory stores, basic planner/router, CLI, hooks, logging/metrics stubs.
- Planned/placeholder: richer skill system, external adapters, persistent stores, advanced RAG, and eval scoring.

## Extension Points
- Tools: register ToolSpec in ToolRegistry.
- Plugins: implement AgentPlugin and pass via AgentOptions.plugins.
- Stores: supply custom MemoryStore and StateStore.
- Router/Planner: provide custom implementations to override defaults.

## Configuration
- CLI reads `~/.tansui/config.json` for LLM configuration (apiKey/model/baseUrl).
- Missing apiKey falls back to a local echo tool for basic usage.

## Testing and Quality
- `pnpm lint` runs ESLint across packages.
- `pnpm test` runs vitest in all workspaces.
- Each package includes a minimal unit test for its primary behavior.

## Release
- `scripts/release-canary.cjs` stamps workspace packages with a canary version derived from the root `package.json`.

## Documentation Discipline
- Update the relevant `agent.md` whenever package responsibilities or interfaces change.

## Engineering Practices
- See `engineering-practices.md` for project-wide best practices.
