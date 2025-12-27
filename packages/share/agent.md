share Package Architecture

Overview
- Purpose: Shared utility helpers used across packages.
- Responsibilities:
  - Provide small, pure utilities (ids, time, error helpers).
  - Keep helpers side-effect free and predictable.

Modules
- id: Deterministic ID and trace id helpers.
- time: Timestamps, durations, and clock abstraction.
- errors: Normalize errors into structured objects.
- async: Timeouts, retries, and concurrency helpers.
- llm: OpenAI chat completion streaming helpers.

Key Interfaces
- createId()
- now()
- toErrorInfo(err)
- withTimeout(promise)
- streamOpenAIChatChunks()
- streamOpenAIChatText()
- openAIChatText()

Data Flow
- Used by core, tools, logging, and perf for common helpers.

Dependencies
- Internal: @tansui/types
- External: openai

Design Decisions
- Avoid heavy dependencies; keep utils small.
- Prefer pure functions over classes.
- LLM helpers default to streaming responses.

Testing Notes
- Unit tests for utility behavior and edge cases.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
