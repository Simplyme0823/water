import { describe, expect, it, vi } from "vitest";
import {
  ToolRegistry,
  createAgent,
  createLoggingPlugin,
  createMetricsPlugin,
} from "../src/index";

describe("core plugins", () => {
  it("logging plugin writes lifecycle logs", async () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };

    const agent = createAgent({
      plugins: [createLoggingPlugin(logger, { logEvents: true })],
    });

    await agent.run("hello");

    expect(logger.info).toHaveBeenCalledWith(
      "agent.run.start",
      expect.objectContaining({ input: "hello" })
    );
    expect(logger.info).toHaveBeenCalledWith(
      "agent.run.end",
      expect.objectContaining({ ok: true })
    );
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      "agent.event",
      expect.objectContaining({ type: "thought" })
    );
  });

  it("metrics plugin records spans and counts", async () => {
    const end = vi.fn();
    const metrics = {
      startSpan: vi.fn(() => ({ end })),
      count: vi.fn(),
    };

    const registry = new ToolRegistry();
    registry.register({
      name: "respond",
      execute: async (input) => ({ ok: true, output: input }),
    });

    const agent = createAgent({
      toolRegistry: registry,
      plugins: [createMetricsPlugin(metrics)],
    });

    await agent.run("hello");

    expect(metrics.startSpan).toHaveBeenCalledWith("agent.run");
    expect(end).toHaveBeenCalled();
    expect(metrics.count).toHaveBeenCalledWith("agent.run.start", 1);
    expect(metrics.count).toHaveBeenCalledWith(
      "agent.run.end",
      1,
      expect.objectContaining({ outcome: "ok" })
    );
    expect(metrics.count).toHaveBeenCalledWith(
      "agent.step.end",
      1,
      expect.objectContaining({ outcome: "ok" })
    );
    expect(metrics.count).toHaveBeenCalledWith(
      "agent.tool.end",
      1,
      expect.objectContaining({ name: "respond", outcome: "ok" })
    );
  });
});
