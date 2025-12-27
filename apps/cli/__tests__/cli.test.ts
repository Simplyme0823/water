import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const homedirMock = vi.hoisted(() => ({ value: "" }));

vi.mock("node:os", async () => {
  const actual = await vi.importActual<typeof import("node:os")>("node:os");
  return {
    ...actual,
    homedir: () => homedirMock.value,
  };
});

import { runCli } from "../src/cli";

describe("runCli", () => {
  let tempHome: string | undefined;

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), "tansui-cli-"));
    homedirMock.value = tempHome;
  });

  afterEach(() => {
    if (tempHome) {
      rmSync(tempHome, { recursive: true, force: true });
      tempHome = undefined;
    }
    homedirMock.value = "";
  });

  it("prints help when --help is provided", async () => {
    const log = vi.fn();
    const error = vi.fn();

    const code = await runCli(["--help"], { log, error });

    expect(code).toBe(0);
    expect(error).not.toHaveBeenCalled();
    expect(String(log.mock.calls[0]?.[0])).toContain("Usage");
  });

  it("runs the agent and logs the observation", async () => {
    const log = vi.fn();
    const error = vi.fn();

    const code = await runCli(["hello"], { log, error });

    expect(code).toBe(0);
    expect(error).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith({ output: { text: "hello" } });
  });
});
