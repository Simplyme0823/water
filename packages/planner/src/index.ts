import type { Plan, Planner, PlannerState } from "@tansui/types";
import { createId } from "@tansui/share";

export class SimplePlanner implements Planner {
  name = "simple";

  async plan(state: PlannerState): Promise<Plan> {
    const canRespond = state.tools.includes("respond");
    const step = canRespond
      ? {
          id: createId("step"),
          type: "tool" as const,
          tool: { name: "respond", input: { text: state.input } },
          note: "default response tool",
        }
      : {
          id: createId("step"),
          type: "respond" as const,
          note: state.input,
        };
    return { steps: [step] };
  }
}
