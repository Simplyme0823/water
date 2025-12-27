share Package Architecture

Overview
- Purpose: Shared utilities and OpenAI streaming helpers.
- Responsibilities:
  - Generate ids and timestamps.
  - Normalize errors for logging/reporting.
  - Provide async helpers like sleep.
  - Wrap OpenAI client creation and streaming chat helpers.

Key Exports
- createId(), nowIso(), toErrorInfo(), sleep()
- createOpenAIClient(), streamOpenAIChatChunks(), streamOpenAIChatText(), openAIChatText()
- OpenAIChatRequest, OpenAIClientOptions, OpenAIChatStreamOptions

Data Flow
- Core uses these helpers to build events and call LLM APIs.

Dependencies
- Internal: (none)
- External: openai

Design Decisions
- Keep utilities small and side-effect free.
- LLM helpers use streaming primitives and aggregate to text.

Testing Notes
- Unit test covers missing apiKey for OpenAI client creation.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
