import { describe, expect, it } from "vitest";
import { DefaultContextBuilder } from "../src/index";

describe("context", () => {
  it("builds a context envelope from memory and rag", async () => {
    const memory = {
      getShortTerm: async () => ["recent"],
      addShortTerm: async () => {},
      getLongTerm: async () => ({ topic: "value" }),
      putLongTerm: async () => {},
    };
    const rag = {
      retrieve: async () => ({ items: [{ id: "1", text: "evidence" }] }),
    };

    const builder = new DefaultContextBuilder(memory, rag, ["system"]);
    const context = await builder.build("input", "session");

    expect(context).toEqual({
      system: ["system"],
      user: "input",
      memory: ["recent", "topic: value"],
      evidence: ["evidence"],
    });
  });
});
