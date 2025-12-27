import { describe, expect, it } from "vitest";
import { createAgent, ToolRegistry } from "../src/index";

describe("core", () => {
  it("emits thought and result events for simple input", async () => {
    const agent = createAgent();
    const events = await agent.run("hello");

    expect(events).toHaveLength(2);
    expect(events.map((event) => event.type)).toEqual(["thought", "result"]);
    expect(events[1]?.data).toEqual({ text: "hello" });
  });

  it("calls plugin hooks during a run", async () => {
    const calls: string[] = [];
    const plugin = {
      name: "trace",
      apply(hooks) {
        hooks.onRunStart.tap("trace", () => calls.push("runStart"));
        hooks.onPlanStart.tap("trace", () => calls.push("planStart"));
        hooks.onPlanEnd.tap("trace", () => calls.push("planEnd"));
        hooks.onStepStart.tap("trace", () => calls.push("stepStart"));
        hooks.onStepEnd.tap("trace", (payload) =>
          calls.push(`stepEnd:${payload.outcome}`)
        );
        hooks.onEvent.tap("trace", (payload) =>
          calls.push(`event:${payload.event.type}`)
        );
        hooks.onRunEnd.tap("trace", (payload) =>
          calls.push(payload.error ? "runEnd:error" : "runEnd:ok")
        );
      },
    };

    const agent = createAgent({ plugins: [plugin] });
    await agent.run("hello");

    expect(calls).toEqual([
      "runStart",
      "event:thought",
      "planStart",
      "planEnd",
      "stepStart",
      "event:result",
      "stepEnd:ok",
      "runEnd:ok",
    ]);
  });

  it("exposes tool hooks when a tool step runs", async () => {
    const registry = new ToolRegistry();
    registry.register({
      name: "respond",
      execute: async (input) => ({ ok: true, output: input }),
    });

    const calls: string[] = [];
    const plugin = {
      name: "tool-trace",
      apply(hooks) {
        hooks.onToolStart.tap("tool-trace", (payload) =>
          calls.push(`toolStart:${payload.tool.name}`)
        );
        hooks.onToolEnd.tap("tool-trace", (payload) =>
          calls.push(`toolEnd:${payload.tool.name}:${payload.result.ok ? "ok" : "error"}`)
        );
      },
    };

    const agent = createAgent({ toolRegistry: registry, plugins: [plugin] });
    await agent.run("hello");

    expect(calls).toEqual(["toolStart:respond", "toolEnd:respond:ok"]);
  });
});
