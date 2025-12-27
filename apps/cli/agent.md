cli Package Architecture

Overview
- Purpose: CLI entrypoint for running the agent in one-shot or interactive mode.
- Responsibilities:
  - Parse CLI arguments and route to run or interactive UI.
  - Load and normalize config from ~/.tansui/config.json.
  - Create the agent with or without LLM configuration.
  - Stream agent events to stdout/stderr.

Modules
- src/index.ts: binary entrypoint.
- src/cli.ts: argument parsing and runCli orchestration.
- src/config.ts: config IO and defaults.
- src/interactive.tsx: Ink-based interactive chat UI.

Key Interfaces
- runCli(args, io?) -> Promise<number>
- runInteractive(agent, { notice? }) -> Promise<number>
- loadConfig(), resolveConfigPath()

Data Flow
- Args -> config -> createAgent -> agent.run -> event output.
- Interactive mode uses Ink to collect input and render messages.

Dependencies
- Internal: @tansui/core, @tansui/tools, @tansui/types, @tansui/share
- External: cac, fs-extra, ink, react

Design Decisions
- If no LLM apiKey is configured, register a local "respond" tool that echoes input.
- Console output is injected for testability.

Testing Notes
- Unit tests cover help output and echo behavior with a mocked homedir.
- Interactive UI is currently covered by manual testing.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
