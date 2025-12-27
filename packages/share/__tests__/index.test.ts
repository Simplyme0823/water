import { describe, expect, it, vi } from "vitest";
import { createId, nowIso, sleep, toErrorInfo } from "../src/index";

describe("share", () => {
  it("creates ids with the provided prefix", () => {
    const id = createId("task");
    expect(id.startsWith("task_")).toBe(true);
  });

  it("returns an ISO timestamp", () => {
    const value = nowIso();
    expect(Number.isNaN(Date.parse(value))).toBe(false);
  });

  it("formats error info consistently", () => {
    const info = toErrorInfo(new Error("boom"));
    expect(info.message).toBe("boom");

    const fallback = toErrorInfo("oops");
    expect(fallback).toEqual({ message: "oops" });
  });

  it("resolves after the requested delay", async () => {
    vi.useFakeTimers();
    const promise = sleep(10);
    vi.advanceTimersByTime(10);
    await promise;
    vi.useRealTimers();
  });
});
