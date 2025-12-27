import { describe, expect, it } from "vitest";
import { createOpenAIClient } from "../src/llm";

describe("llm", () => {
  it("throws when OpenAI API key is missing", () => {
    expect(() => createOpenAIClient()).toThrow("apiKey");
  });
});
