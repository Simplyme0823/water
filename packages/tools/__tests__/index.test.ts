import { describe, expect, it, vi } from "vitest";
import { DefaultToolRunner, ToolRegistry } from "../src/index";

describe("tools", () => {
  it("registers and lists tools", () => {
    const registry = new ToolRegistry();
    const tool = {
      name: "echo",
      execute: vi.fn(async (input) => ({ ok: true, output: input })),
    };

    registry.register(tool);

    expect(registry.get("echo")).toBe(tool);
    expect(registry.list()).toEqual(["echo"]);
  });

  it("runs tools and reports missing tools", async () => {
    const registry = new ToolRegistry();
    const runner = new DefaultToolRunner(registry);

    const missing = await runner.run({ name: "missing", input: {} }, {});
    expect(missing.ok).toBe(false);
    expect(missing.error).toContain("Tool not found");

    const tool = {
      name: "echo",
      execute: vi.fn(async (input) => ({ ok: true, output: input })),
    };
    registry.register(tool);

    const result = await runner.run({ name: "echo", input: { text: "hi" } }, {});
    expect(result.ok).toBe(true);
    expect(result.output).toEqual({ text: "hi" });
  });
});
