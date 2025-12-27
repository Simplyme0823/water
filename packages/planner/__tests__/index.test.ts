import { describe, expect, it } from "vitest";
import { SimplePlanner } from "../src/index";

describe("planner", () => {
  it("returns a tool step when respond tool exists", async () => {
    const planner = new SimplePlanner();
    const context = { system: [], user: "", memory: [], evidence: [] };

    const plan = await planner.plan({ input: "hello", context, tools: ["respond"] });
    const step = plan.steps[0];

    expect(step.type).toBe("tool");
    expect(step.tool?.name).toBe("respond");
    expect(step.id.startsWith("step_")).toBe(true);
  });

  it("returns a respond step when no tool is available", async () => {
    const planner = new SimplePlanner();
    const context = { system: [], user: "", memory: [], evidence: [] };

    const plan = await planner.plan({ input: "hello", context, tools: [] });
    const step = plan.steps[0];

    expect(step.type).toBe("respond");
    expect(step.note).toBe("hello");
  });
});
