import { AsyncSeriesHook as TapableAsyncSeriesHook } from "tapable";
import type {
  AgentEvent,
  ContextEnvelope,
  Id,
  Plan,
  PlanStep,
  ToolCall,
  ToolResult,
} from "@tansui/types";

/** Hook handler invoked in registration order. */
export type HookHandler<T> = (payload: T) => void | Promise<void>;

export interface Hook<T> {
  /** Register a handler with a unique name for debugging. */
  tap(name: string, handler: HookHandler<T>): void;
}

/** Async hook backed by tapable; handlers run sequentially. */
export class AsyncSeriesHook<T> implements Hook<T> {
  private readonly hook = new TapableAsyncSeriesHook<[T]>(["payload"]);

  tap(name: string, handler: HookHandler<T>): void {
    this.hook.tapPromise(name, async (payload) => {
        await handler(payload);
    });
  }

  async call(payload: T): Promise<void> {
    await this.hook.promise(payload);
  }
}

/** Shared run context provided to all hooks. */
export interface AgentRunPayload {
  input: string;
  sessionId: Id;
  taskId: Id;
}

/** Run completion payload; error is set when the run fails. */
export interface AgentRunEndPayload extends AgentRunPayload {
  error?: { message: string; stack?: string };
}

/** Planner input payload for instrumentation and policy checks. */
export interface AgentPlanStartPayload extends AgentRunPayload {
  context: ContextEnvelope;
  tools: string[];
}

/** Planner output payload containing the computed plan. */
export interface AgentPlanEndPayload extends AgentRunPayload {
  plan: Plan;
}

/** Fired before a plan step executes. */
export interface AgentStepStartPayload extends AgentRunPayload {
  step: PlanStep;
}

/** Fired after a plan step completes. */
export interface AgentStepEndPayload extends AgentRunPayload {
  step: PlanStep;
  outcome: "ok" | "error";
  toolResult?: ToolResult;
}

/** Fired immediately before a tool executes. */
export interface AgentToolStartPayload extends AgentRunPayload {
  tool: ToolCall;
}

/** Fired immediately after a tool executes. */
export interface AgentToolEndPayload extends AgentRunPayload {
  tool: ToolCall;
  result: ToolResult;
}

/** Fired whenever the agent emits an event. */
export interface AgentEventPayload extends AgentRunPayload {
  event: AgentEvent;
}

/** All lifecycle hooks available to plugins. */
export interface AgentHooks {
  /** Called at the very start of a run. */
  onRunStart: Hook<AgentRunPayload>;
  /** Called once when the run completes (success or error). */
  onRunEnd: Hook<AgentRunEndPayload>;
  /** Called before planner execution with full planner inputs. */
  onPlanStart: Hook<AgentPlanStartPayload>;
  /** Called after the planner returns a plan. */
  onPlanEnd: Hook<AgentPlanEndPayload>;
  /** Called before each plan step executes. */
  onStepStart: Hook<AgentStepStartPayload>;
  /** Called after each plan step completes. */
  onStepEnd: Hook<AgentStepEndPayload>;
  /** Called immediately before a tool executes. */
  onToolStart: Hook<AgentToolStartPayload>;
  /** Called immediately after a tool executes. */
  onToolEnd: Hook<AgentToolEndPayload>;
  /** Called for every emitted AgentEvent. */
  onEvent: Hook<AgentEventPayload>;
}


export interface AgentPlugin {
  name: string;
  apply(hooks: AgentHooks): void;
}

export type AgentHookCollection = {
  onRunStart: AsyncSeriesHook<AgentRunPayload>;
  onRunEnd: AsyncSeriesHook<AgentRunEndPayload>;
  onPlanStart: AsyncSeriesHook<AgentPlanStartPayload>;
  onPlanEnd: AsyncSeriesHook<AgentPlanEndPayload>;
  onStepStart: AsyncSeriesHook<AgentStepStartPayload>;
  onStepEnd: AsyncSeriesHook<AgentStepEndPayload>;
  onToolStart: AsyncSeriesHook<AgentToolStartPayload>;
  onToolEnd: AsyncSeriesHook<AgentToolEndPayload>;
  onEvent: AsyncSeriesHook<AgentEventPayload>;
};

export function createAgentHooks(): AgentHookCollection {
  return {
    onRunStart: new AsyncSeriesHook<AgentRunPayload>(),
    onRunEnd: new AsyncSeriesHook<AgentRunEndPayload>(),
    onPlanStart: new AsyncSeriesHook<AgentPlanStartPayload>(),
    onPlanEnd: new AsyncSeriesHook<AgentPlanEndPayload>(),
    onStepStart: new AsyncSeriesHook<AgentStepStartPayload>(),
    onStepEnd: new AsyncSeriesHook<AgentStepEndPayload>(),
    onToolStart: new AsyncSeriesHook<AgentToolStartPayload>(),
    onToolEnd: new AsyncSeriesHook<AgentToolEndPayload>(),
    onEvent: new AsyncSeriesHook<AgentEventPayload>(),
  };
}
