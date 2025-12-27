import type { Logger, Metrics, Span } from "@tansui/types";
import type { AgentPlugin } from "./hooks.js";

export type LoggingPluginOptions = {
  logEvents?: boolean;
  includeEventData?: boolean;
  logRunLifecycle?: boolean;
  logToolEnd?: boolean;
  logErrors?: boolean;
};

export function createLoggingPlugin(
  logger: Logger,
  options: LoggingPluginOptions = {}
): AgentPlugin {
  const {
    logEvents = false,
    includeEventData = false,
    logRunLifecycle = true,
    logToolEnd = true,
    logErrors = true,
  } = options;
  const debug = logger.debug ?? logger.info;

  return {
    name: "logging",
    apply(hooks) {
      if (logRunLifecycle) {
        hooks.onRunStart.tap("logging", ({ sessionId, taskId, input }) => {
          logger.info("agent.run.start", { sessionId, taskId, input });
        });
      }

      hooks.onRunEnd.tap("logging", ({ sessionId, taskId, error }) => {
        if (logErrors && error) {
          logger.error("agent.run.error", { sessionId, taskId, ...error });
        }
        if (logRunLifecycle) {
          logger.info("agent.run.end", { sessionId, taskId, ok: !error, error });
        }
      });

      if (logToolEnd) {
        hooks.onToolEnd.tap("logging", ({ sessionId, taskId, tool, result }) => {
          debug("agent.tool.end", {
            sessionId,
            taskId,
            tool: tool.name,
            ok: result.ok,
            error: result.error,
          });
        });
      }

      if (logEvents) {
        hooks.onEvent.tap("logging", ({ sessionId, taskId, event }) => {
          const fields: Record<string, unknown> = {
            sessionId,
            taskId,
            type: event.type,
          };
          if (includeEventData) {
            fields.data = event.data;
          }
          debug("agent.event", fields);
        });
      }
    },
  };
}

export type MetricsPluginOptions = {
  prefix?: string;
};

export function createMetricsPlugin(
  metrics: Metrics,
  options: MetricsPluginOptions = {}
): AgentPlugin {
  const prefix = options.prefix ?? "agent.";
  const spans = new Map<string, Span>();
  const metric = (name: string) => `${prefix}${name}`;
  const runKey = (sessionId: string, taskId: string) => `${sessionId}:${taskId}`;

  return {
    name: "metrics",
    apply(hooks) {
      hooks.onRunStart.tap("metrics", ({ sessionId, taskId }) => {
        spans.set(runKey(sessionId, taskId), metrics.startSpan(metric("run")));
        metrics.count(metric("run.start"), 1);
      });

      hooks.onRunEnd.tap("metrics", ({ sessionId, taskId, error }) => {
        const key = runKey(sessionId, taskId);
        spans.get(key)?.end();
        spans.delete(key);
        metrics.count(metric("run.end"), 1, { outcome: error ? "error" : "ok" });
        if (error) {
          metrics.count(metric("error"), 1);
        }
      });

      hooks.onStepEnd.tap("metrics", ({ outcome }) => {
        metrics.count(metric("step.end"), 1, { outcome });
      });

      hooks.onToolEnd.tap("metrics", ({ tool, result }) => {
        metrics.count(metric("tool.end"), 1, {
          name: tool.name,
          outcome: result.ok ? "ok" : "error",
        });
      });

    },
  };
}
