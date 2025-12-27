export function createId(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function toErrorInfo(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export * from "./llm.js";
