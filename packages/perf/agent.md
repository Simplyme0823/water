perf Package Architecture

Overview
- Purpose: Performance metrics and profiling.
- Responsibilities:
  - Collect latency/throughput/error metrics.
  - Export metrics to sinks.

Modules
- collector: MetricsCollector with timers and counters.
- timer: Span timing and aggregation.
- exporter: Export to logs or external systems.

Key Interfaces
- startSpan(name)
- record(name, value)
- inc(name)

Data Flow
- Core/tools record metrics -> exporter.

Dependencies
- Internal: @tansui/types, @tansui/share
- External: (none)

Design Decisions
- Low overhead by default; sampling supported.

Testing Notes
- Counter and timer unit tests.

Engineering Practices
- See `../../engineering-practices.md` for project-wide best practices.
