import { describe, expect, it, vi } from "vitest";
import type { ContextBuilder, ContextEnvelope } from "@tansui/types";
import { createAgent } from "../src/index";

const openAIChatTextMock = vi.hoisted(() => vi.fn());

vi.mock("@tansui/share", async () => {
  const actual = await vi.importActual<typeof import("@tansui/share")>(
    "@tansui/share"
  );
  return {
    ...actual,
    openAIChatText: openAIChatTextMock,
  };
});

describe("core llm", () => {
  it("uses llm response when configured", async () => {
    openAIChatTextMock.mockResolvedValueOnce("llm-output");
    const context: ContextEnvelope = {
      system: ["system-prompt"],
      user: "hello",
      memory: ["remember this"],
      evidence: ["some evidence"],
    };
    const contextBuilder: ContextBuilder = {
      build: async () => context,
    };

    const agent = createAgent({
      contextBuilder,
      llm: {
        apiKey: "test-key",
        model: "GLM-4.7",
        request: { temperature: 0.2 },
      },
    });

    const events = await agent.run("hello");

    expect(events[1]?.data).toEqual({ text: "llm-output" });
    expect(openAIChatTextMock).toHaveBeenCalledTimes(1);

    const callOptions = openAIChatTextMock.mock.calls[0]?.[0];
    expect(callOptions).toEqual(
      expect.objectContaining({
        apiKey: "test-key",
        request: expect.objectContaining({
          model: "GLM-4.7",
          temperature: 0.2,
          messages: [
            { role: "system", content: "system-prompt" },
            {
              role: "system",
              content: "Memory:\n- remember this\n\nEvidence:\n- some evidence",
            },
            { role: "user", content: "hello" },
          ],
        }),
      })
    );
  });
});
