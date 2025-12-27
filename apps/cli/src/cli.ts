import { cac } from "cac";
import { createAgent, ToolRegistry, type AgentLlmOptions } from "@tansui/core";
import type { ToolSpec } from "@tansui/types";
import { loadConfig, resolveConfigPath } from "./config.js";
import { runInteractive } from "./interactive.js";

type CliIo = {
  log: (message: unknown) => void;
  error: (message: unknown) => void;
};

function createMissingApiNotice(configPath: string): string {
  return `LLM API key is not configured. Edit ${configPath} to set llm.apiKey.`;
}

async function resolveLlmOptions(): Promise<{
  llm?: AgentLlmOptions;
  notice?: string;
}> {
  const config = await loadConfig();
  const apiKey = config.llm.apiKey;
  const model = config.llm.model;
  const baseUrl = config.llm.baseUrl;
  if (!apiKey) {
    return { notice: createMissingApiNotice(resolveConfigPath()) };
  }
  return { llm: baseUrl ? { apiKey, model, baseURL: baseUrl } : { apiKey, model } };
}

function createCliAgent(llm?: AgentLlmOptions) {
  const registry = new ToolRegistry();
  if (!llm) {
    const respondTool: ToolSpec<{ text: string }, { text: string }> = {
      name: "respond",
      description: "Echo the input text.",
      async execute(payload) {
        return { ok: true, output: { text: payload.text } };
      },
    };
    registry.register(respondTool);
  }

  return createAgent({ toolRegistry: registry, llm });
}

export async function runCli(args: string[], io: CliIo = console): Promise<number> {
  const cli = cac("tansui");
  cli.option("-h, --help", "Show this help message");
  cli.option("-i, --interactive", "Start the interactive chat UI");

  const outputHelp = () => {
    // Route cac help output to the injected logger for testability.
    const originalLog = console.log;
    console.log = io.log;
    try {
      cli.outputHelp();
    } finally {
      console.log = originalLog;
    }
  };

  cli
    .command("[...input]", "Run the agent with input text")
    .usage("<text>")
    .action(async (input: string[] = []) => {
      if (input.length === 0) {
        outputHelp();
        return 0;
      }

      const message = input.join(" ").trim();
      const { llm, notice } = await resolveLlmOptions();
      if (notice) {
        io.log(notice);
      }
      const agent = createCliAgent(llm);

      try {
        const events = await agent.run(message);
        for (const event of events) {
          if (event.type === "result" || event.type === "observation") {
            io.log(event.data);
          } else if (event.type === "error") {
            io.error(event.data);
          }
        }
        return 0;
      } catch (error) {
        io.error(error);
        return 1;
      }
    });

  if (args.length === 0) {
    try {
      const { llm, notice } = await resolveLlmOptions();
      return await runInteractive(createCliAgent(llm), { notice });
    } catch (error) {
      io.error(error);
      return 1;
    }
  }

  const parsed = cli.parse(["node", "tansui", ...args], { run: false });

  if (parsed.options.help) {
    outputHelp();
    return 0;
  }

  if (parsed.options.interactive) {
    try {
      const { llm, notice } = await resolveLlmOptions();
      return await runInteractive(createCliAgent(llm), { notice });
    } catch (error) {
      io.error(error);
      return 1;
    }
  }

  try {
    const result = await Promise.resolve(cli.runMatchedCommand());
    return typeof result === "number" ? result : 0;
  } catch (error) {
    io.error(error);
    return 1;
  }
}
