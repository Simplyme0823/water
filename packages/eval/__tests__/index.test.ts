import { describe, expect, it } from "vitest";
import { EvalRunner } from "../src/index";

describe("eval", () => {
  it("summarizes suite results", async () => {
    const runner = new EvalRunner();
    const report = await runner.runSuite({
      name: "suite",
      cases: [{ input: "one" }, { input: "two" }],
    });

    expect(report).toEqual({ suite: "suite", total: 2, passed: 0 });
  });
});
