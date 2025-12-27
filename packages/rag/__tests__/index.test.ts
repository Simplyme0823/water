import { describe, expect, it } from "vitest";
import { EmptyRagClient } from "../src/index";

describe("rag", () => {
  it("returns empty evidence by default", async () => {
    const client = new EmptyRagClient();
    const result = await client.retrieve({ query: "anything" });

    expect(result.items).toEqual([]);
  });
});
