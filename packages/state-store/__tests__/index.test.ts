import { describe, expect, it } from "vitest";
import { InMemoryStateStore } from "../src/index";

describe("state-store", () => {
  it("saves checkpoints and events", async () => {
    const store = new InMemoryStateStore();
    const event = {
      type: "result",
      timestamp: "now",
      data: { text: "done" },
    };

    await store.saveCheckpoint("session", { step: 1 });
    await store.appendEvent("session", event);

    const session = await store.loadSession("session");

    expect(session.checkpoint).toEqual({ step: 1 });
    expect(session.events).toEqual([event]);
  });
});
