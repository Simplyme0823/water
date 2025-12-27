import { describe, expect, it } from "vitest";
import { MetricsCollector } from "../src/index";

describe("perf", () => {
  it("returns spans and accepts counts", () => {
    const metrics = new MetricsCollector();
    const span = metrics.startSpan("work");

    expect(typeof span.end).toBe("function");
    expect(() => span.end()).not.toThrow();
    expect(() => metrics.count("hits", 2, { source: "test" })).not.toThrow();
  });
});
