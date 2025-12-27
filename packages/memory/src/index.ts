import type { MemoryStore } from "@tansui/types";

export class InMemoryMemoryStore implements MemoryStore {
  private readonly shortTerm = new Map<string, string[]>();
  private readonly longTerm = new Map<string, Record<string, string>>();

  async getShortTerm(sessionId: string): Promise<string[]> {
    return this.shortTerm.get(sessionId) ?? [];
  }

  async addShortTerm(sessionId: string, text: string): Promise<void> {
    const list = this.shortTerm.get(sessionId) ?? [];
    list.push(text);
    this.shortTerm.set(sessionId, list);
  }

  async getLongTerm(sessionId: string): Promise<Record<string, string>> {
    return this.longTerm.get(sessionId) ?? {};
  }

  async putLongTerm(sessionId: string, key: string, value: string): Promise<void> {
    const record = this.longTerm.get(sessionId) ?? {};
    record[key] = value;
    this.longTerm.set(sessionId, record);
  }
}
