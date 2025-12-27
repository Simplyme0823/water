export type Id = string;

export type AgentEventType = "thought" | "action" | "observation" | "result" | "error";

export interface AgentEvent<T = unknown> {
  type: AgentEventType;
  timestamp: string;
  sessionId?: Id;
  taskId?: Id;
  data: T;
}

export interface ToolContext {
  sessionId?: Id;
  taskId?: Id;
  traceId?: Id;
}

export interface ToolResult<T = unknown> {
  ok: boolean;
  output?: T;
  error?: string;
}

export interface ToolSpec<TInput = unknown, TOutput = unknown> {
  name: string;
  description?: string;
  execute(input: TInput, ctx: ToolContext): Promise<ToolResult<TOutput>>;
}

export interface ToolCall<TInput = unknown> {
  name: string;
  input: TInput;
}

export interface ToolRunner {
  run(call: ToolCall, ctx: ToolContext): Promise<ToolResult>;
}

export interface PlanStep {
  id: Id;
  type: "tool" | "respond";
  tool?: ToolCall;
  note?: string;
}

export interface Plan {
  steps: PlanStep[];
}

export interface RouteDecision {
  planner: string;
  skill?: string;
  requiredTools?: string[];
}

export interface ContextEnvelope {
  system: string[];
  user: string;
  memory: string[];
  evidence: string[];
}

export interface PlannerState {
  input: string;
  context: ContextEnvelope;
  tools: string[];
}

export interface Planner {
  name: string;
  plan(state: PlannerState): Promise<Plan>;
}

export interface Router {
  route(input: string): RouteDecision;
}

export interface MemoryStore {
  getShortTerm(sessionId: Id): Promise<string[]>;
  addShortTerm(sessionId: Id, text: string): Promise<void>;
  getLongTerm(sessionId: Id): Promise<Record<string, string>>;
  putLongTerm(sessionId: Id, key: string, value: string): Promise<void>;
}

export interface EvidenceItem {
  id: string;
  text: string;
  source?: string;
  score?: number;
}

export interface EvidencePack {
  items: EvidenceItem[];
}

export interface RagClient {
  retrieve(input: { query: string }): Promise<EvidencePack>;
}

export interface ContextBuilder {
  build(input: string, sessionId: Id): Promise<ContextEnvelope>;
}

export interface StateStore {
  saveCheckpoint(sessionId: Id, state: unknown): Promise<void>;
  appendEvent(sessionId: Id, event: AgentEvent): Promise<void>;
  loadSession(sessionId: Id): Promise<{ checkpoint?: unknown; events: AgentEvent[] }>;
}

export interface Logger {
  info(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
  debug?(message: string, fields?: Record<string, unknown>): void;
}

export interface Span {
  end(): void;
}

export interface Metrics {
  startSpan(name: string): Span;
  count(name: string, value?: number, tags?: Record<string, string>): void;
}
