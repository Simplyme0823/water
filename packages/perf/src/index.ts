import type { Metrics, Span } from "@tansui/types";

class NoopSpan implements Span {
  end(): void {
    // no-op
  }
}

export class MetricsCollector implements Metrics {
  // eslint-disable-next-line
  startSpan(_name: string): Span {
    return new NoopSpan();
  }
  // eslint-disable-next-line
  count(_name: string, _value = 1, _tags?: Record<string, string>): void {
    // no-op
  }
}
