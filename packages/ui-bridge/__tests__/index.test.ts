import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../src/index";

describe("ui-bridge", () => {
  it("publishes events to subscribers", () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const unsubscribe = bus.subscribe(handler);

    const event = { type: "result", timestamp: "now", data: { text: "ok" } };

    bus.publish(event);
    expect(handler).toHaveBeenCalledWith(event);

    unsubscribe();
    bus.publish({ type: "result", timestamp: "later", data: { text: "skip" } });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
