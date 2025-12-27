import { describe, expect, it } from "vitest";
import { InMemoryMemoryStore } from "../src/index";

describe("memory", () => {
  it("stores short-term and long-term memory", async () => {
    const store = new InMemoryMemoryStore();

    await store.addShortTerm("session", "first");
    await store.addShortTerm("session", "second");
    await store.putLongTerm("session", "topic", "value");

    await expect(store.getShortTerm("session")).resolves.toEqual(["first", "second"]);
    await expect(store.getLongTerm("session")).resolves.toEqual({ topic: "value" });
  });
});
