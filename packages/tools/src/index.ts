import type { ToolCall, ToolContext, ToolResult, ToolRunner, ToolSpec } from "@tansui/types";

export class ToolRegistry {
  private readonly tools = new Map<string, ToolSpec>();

  register(tool: ToolSpec): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolSpec | undefined {
    return this.tools.get(name);
  }

  list(): string[] {
    return [...this.tools.keys()];
  }
}

export class DefaultToolRunner implements ToolRunner {
  constructor(private readonly registry: ToolRegistry) {}

  async run(call: ToolCall, ctx: ToolContext): Promise<ToolResult> {
    const tool = this.registry.get(call.name);
    if (!tool) {
      return { ok: false, error: `Tool not found: ${call.name}` };
    }
    return tool.execute(call.input, ctx);
  }
}
