import type { ContextBuilder, ContextEnvelope, MemoryStore, RagClient } from "@tansui/types";

export class DefaultContextBuilder implements ContextBuilder {
  constructor(
    private readonly memory: MemoryStore,
    private readonly rag?: RagClient,
    private readonly systemPrompts: string[] = ["You are a helpful agent."]
  ) {}

  async build(input: string, sessionId: string): Promise<ContextEnvelope> {
    const shortTerm = await this.memory.getShortTerm(sessionId);
    const longTerm = await this.memory.getLongTerm(sessionId);
    const memory = [...shortTerm, ...Object.entries(longTerm).map(([k, v]) => `${k}: ${v}`)];

    const evidenceItems = this.rag
      ? (await this.rag.retrieve({ query: input })).items
      : [];

    return {
      system: this.systemPrompts,
      user: input,
      memory,
      evidence: evidenceItems.map((item) => item.text),
    };
  }
}
