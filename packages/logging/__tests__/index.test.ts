import { describe, expect, it, vi } from "vitest";
import { createConsoleLogger } from "../src/index";

describe("logging", () => {
  it("writes to console methods", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const logger = createConsoleLogger();

    logger.info("info", { ok: true });
    logger.error("error", { ok: false });
    logger.info("info-default");

    expect(log).toHaveBeenCalledWith("info", { ok: true });
    expect(error).toHaveBeenCalledWith("error", { ok: false });
    expect(log).toHaveBeenCalledWith("info-default", {});

    vi.restoreAllMocks();
  });
});
