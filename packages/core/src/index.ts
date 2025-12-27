import type {
  AgentEvent,
  ContextBuilder,
  ContextEnvelope,
  MemoryStore,
  Planner,
  Router,
  StateStore,
  ToolRunner,
} from "@tansui/types";
import {
  createId,
  nowIso,
  openAIChatText,
  type OpenAIChatRequest,
  type OpenAIClientOptions,
  toErrorInfo,
} from "@tansui/share";
import { DefaultRouter } from "@tansui/router";
import { SimplePlanner } from "@tansui/planner";
import { DefaultContextBuilder } from "@tansui/context";
import { InMemoryMemoryStore } from "@tansui/memory";
import { EmptyRagClient } from "@tansui/rag";
import { InMemoryStateStore } from "@tansui/state-store";
import { createConsoleLogger } from "@tansui/logging";
import { MetricsCollector } from "@tansui/perf";
import { DefaultToolRunner, ToolRegistry } from "@tansui/tools";
import {
  createAgentHooks,
  type AgentHookCollection,
  type AgentPlugin,
  type AsyncSeriesHook,
} from "./hooks.js";
import { createLoggingPlugin, createMetricsPlugin } from "./plugins.js";

export interface AgentOptions {
  router?: Router;
  planner?: Planner;
  contextBuilder?: ContextBuilder;
  toolRunner?: ToolRunner;
  toolRegistry?: ToolRegistry;
  memory?: MemoryStore;
  stateStore?: StateStore;
  llm?: AgentLlmOptions;
  plugins?: AgentPlugin[];
}

export interface AgentLlmOptions extends Omit<OpenAIClientOptions, "apiKey"> {
  apiKey: string;
  model: string;
  request?: Omit<OpenAIChatRequest, "model" | "messages">;
}

export class Agent {
  private readonly router: Router;
  private readonly planner: Planner;
  private readonly contextBuilder: ContextBuilder;
  private readonly toolRunner: ToolRunner;
  private readonly toolRegistry?: ToolRegistry;
  private readonly memory: MemoryStore;
  private readonly stateStore: StateStore;
  private readonly llm?: AgentLlmOptions;
  private readonly hooks: AgentHookCollection;

  constructor(options: AgentOptions) {
    this.router = options.router ?? new DefaultRouter();
    this.planner = options.planner ?? new SimplePlanner();
    this.memory = options.memory ?? new InMemoryMemoryStore();
    this.contextBuilder =
      options.contextBuilder ?? new DefaultContextBuilder(this.memory, new EmptyRagClient());
    this.toolRegistry = options.toolRegistry;
    this.toolRunner =
      options.toolRunner ?? new DefaultToolRunner(this.toolRegistry ?? new ToolRegistry());
    this.stateStore = options.stateStore ?? new InMemoryStateStore();
    this.llm = options.llm;
    this.hooks = createAgentHooks();
    const builtInPlugins: AgentPlugin[] = [
      createLoggingPlugin(createConsoleLogger(), {
        logRunLifecycle: false,
        logToolEnd: false,
        logEvents: false,
        logErrors: true,
      }),
      createMetricsPlugin(new MetricsCollector()),
    ];
    const userPlugins = options.plugins ?? [];
    const userPluginNames = new Set(userPlugins.map((plugin) => plugin.name));
    const plugins = [
      ...builtInPlugins.filter((plugin) => !userPluginNames.has(plugin.name)),
      ...userPlugins,
    ];

    for (const plugin of plugins) {
      plugin.apply(this.hooks);
    }
  }

  private async callHook<T>(hook: AsyncSeriesHook<T>, payload: T): Promise<void> {
    await hook.call(payload);
  }

  private buildLlmMessages(
    context: ContextEnvelope,
    input: string
  ): OpenAIChatRequest["messages"] {
    const messages: OpenAIChatRequest["messages"] = [];
    for (const prompt of context.system) {
      messages.push({ role: "system", content: prompt });
    }

    const contextBlocks: string[] = [];
    if (context.memory.length > 0) {
      contextBlocks.push(`Memory:\n- ${context.memory.join("\n- ")}`);
    }
    if (context.evidence.length > 0) {
      contextBlocks.push(`Evidence:\n- ${context.evidence.join("\n- ")}`);
    }
    if (contextBlocks.length > 0) {
      messages.push({ role: "system", content: contextBlocks.join("\n\n") });
    }

    messages.push({ role: "user", content: input });
    return messages;
  }

  private async generateWithLlm(context: ContextEnvelope, input: string): Promise<string> {
    if (!this.llm) {
      return input;
    }
    const { model, request, ...clientOptions } = this.llm;
    const chatRequest: OpenAIChatRequest = {
      model,
      messages: this.buildLlmMessages(context, input),
      ...request,
    };

    return openAIChatText({ request: chatRequest, ...clientOptions });
  }

  async run(input: string, sessionId = createId("session")): Promise<AgentEvent[]> {
    const taskId = createId("task");
    const runInfo = { input, sessionId, taskId };
    let runError: { message: string; stack?: string } | undefined;
    const events: AgentEvent[] = [];

    const emit = async (event: AgentEvent): Promise<AgentEvent> => {
      await this.stateStore.appendEvent(sessionId, event);
      await this.callHook(this.hooks.onEvent, { ...runInfo, event });
      events.push(event);
      return event;
    };

    try {
      await this.callHook(this.hooks.onRunStart, runInfo);
      await this.memory.addShortTerm(sessionId, input);
      const route = this.router.route(input);
      await emit({
        type: "thought",
        timestamp: nowIso(),
        sessionId,
        taskId,
        data: { route },
      });

      const context = await this.contextBuilder.build(input, sessionId);
      const tools = this.toolRegistry?.list() ?? [];
      await this.callHook(this.hooks.onPlanStart, { ...runInfo, context, tools });
      const plan = await this.planner.plan({ input, context, tools });
      await this.callHook(this.hooks.onPlanEnd, { ...runInfo, plan });
      await this.stateStore.saveCheckpoint(sessionId, { input, plan });

      for (const step of plan.steps) {
        await this.callHook(this.hooks.onStepStart, { ...runInfo, step });
        if (step.type === "tool" && step.tool) {
          await this.callHook(
            this.hooks.onToolStart,
            { ...runInfo, tool: step.tool }
          );
          await emit({
            type: "action",
            timestamp: nowIso(),
            sessionId,
            taskId,
            data: { tool: step.tool },
          });
          const result = await this.toolRunner.run(step.tool, { sessionId, taskId });
          await this.callHook(
            this.hooks.onToolEnd,
            { ...runInfo, tool: step.tool, result }
          );
          if (!result.ok) {
            runError = { message: result.error ?? "tool error" };
            await emit({
              type: "error",
              timestamp: nowIso(),
              sessionId,
              taskId,
              data: { error: result.error ?? "tool error" },
            });
            await this.callHook(
              this.hooks.onStepEnd,
              { ...runInfo, step, outcome: "error", toolResult: result }
            );
            return events;
          }
          await emit({
            type: "observation",
            timestamp: nowIso(),
            sessionId,
            taskId,
            data: { output: result.output },
          });
          await this.callHook(
            this.hooks.onStepEnd,
            { ...runInfo, step, outcome: "ok", toolResult: result }
          );
        } else {
          const responseInput = step.note ?? input;
          const responseText = this.llm
            ? await this.generateWithLlm(context, responseInput)
            : responseInput;
          await emit({
            type: "result",
            timestamp: nowIso(),
            sessionId,
            taskId,
            data: { text: responseText },
          });
          await this.callHook(
            this.hooks.onStepEnd,
            { ...runInfo, step, outcome: "ok" }
          );
        }
      }
    } catch (error) {
      runError = toErrorInfo(error);
      const errorEvent: AgentEvent = {
        type: "error",
        timestamp: nowIso(),
        sessionId,
        taskId,
        data: runError,
      };
      await emit(errorEvent);
    } finally {
      await this.callHook(this.hooks.onRunEnd, { ...runInfo, error: runError });
    }

    return events;
  }
}

export function createAgent(options: AgentOptions = {}): Agent {
  return new Agent(options);
}

export { ToolRegistry } from "@tansui/tools";
export type { ToolSpec } from "@tansui/types";
export type { AgentHooks, AgentPlugin, Hook } from "./hooks.js";
export { createLoggingPlugin, createMetricsPlugin } from "./plugins.js";
export type { LoggingPluginOptions, MetricsPluginOptions } from "./plugins.js";
