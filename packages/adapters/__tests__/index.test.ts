import { describe, expectTypeOf, it } from "vitest";
import type { IoAdapter, LlmAdapter, McpAdapter } from "../src/index";

describe("adapters types", () => {
  it("matches adapter shapes", () => {
    type LlmExpected = {
      complete: (input: { prompt: string }) => Promise<{ text: string }>;
    };
    type McpExpected = {
      request: <T = unknown>(
        method: string,
        params?: Record<string, unknown>
      ) => Promise<T>;
    };
    type IoExpected = {
      read: (path: string) => Promise<string>;
      write: (path: string, content: string) => Promise<void>;
    };

    expectTypeOf<LlmAdapter>().toMatchTypeOf<LlmExpected>();
    expectTypeOf<McpAdapter>().toMatchTypeOf<McpExpected>();
    expectTypeOf<IoAdapter>().toMatchTypeOf<IoExpected>();
  });
});
