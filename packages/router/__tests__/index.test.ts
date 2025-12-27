import { describe, expect, it } from "vitest";
import { DefaultRouter } from "../src/index";

describe("router", () => {
  it("uses the simple planner by default", () => {
    const router = new DefaultRouter();
    expect(router.route("hello")).toEqual({ planner: "simple" });
  });

  it("allows overriding the default planner", () => {
    const router = new DefaultRouter("custom");
    expect(router.route("hello").planner).toBe("custom");
  });
});
