import type { RouteDecision, Router } from "@tansui/types";

export class DefaultRouter implements Router {
  constructor(private readonly defaultPlanner = "simple") {}
  // eslint-disable-next-line
  route(_input: string): RouteDecision {
    return { planner: this.defaultPlanner };
  }
}
