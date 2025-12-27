import OpenAI from "openai";
import type {
  ChatCompletionChunk,
  ChatCompletionCreateParamsStreaming,
} from "openai/resources/chat/completions";

export type OpenAIClientOptions = {
  apiKey?: string;
  baseURL?: string;
  organization?: string;
  project?: string;
  timeout?: number;
  maxRetries?: number;
};

export type OpenAIChatRequest = Omit<ChatCompletionCreateParamsStreaming, "stream">;

export type OpenAIChatStreamOptions = OpenAIClientOptions & {
  client?: OpenAI;
  request: OpenAIChatRequest;
};

function resolveApiKey(apiKey?: string): string {
  if (!apiKey) {
    throw new Error("OpenAI apiKey is required to call OpenAI.");
  }
  return apiKey;
}

export function createOpenAIClient(options: OpenAIClientOptions = {}): OpenAI {
  return new OpenAI({
    apiKey: resolveApiKey(options.apiKey),
    baseURL: options.baseURL,
    organization: options.organization,
    project: options.project,
    timeout: options.timeout,
    maxRetries: options.maxRetries,
  });
}

function resolveClient(options: OpenAIChatStreamOptions): OpenAI {
  if (options.client) {
    return options.client;
  }
  // eslint-disable-next-line
  const { request: _request, client: _client, ...clientOptions } = options;
  return createOpenAIClient(clientOptions);
}

export async function* streamOpenAIChatChunks(
  options: OpenAIChatStreamOptions
): AsyncGenerator<ChatCompletionChunk> {
  const client = resolveClient(options);
  const stream = await client.chat.completions.create({
    ...options.request,
    stream: true,
  });

  for await (const chunk of stream) {
    yield chunk;
  }
}

export async function* streamOpenAIChatText(
  options: OpenAIChatStreamOptions
): AsyncGenerator<string> {
  for await (const chunk of streamOpenAIChatChunks(options)) {
    const text = chunk.choices?.[0]?.delta?.content;
    if (text) {
      yield text;
    }
  }
}

export async function openAIChatText(
  options: OpenAIChatStreamOptions
): Promise<string> {
  let output = "";
  for await (const text of streamOpenAIChatText(options)) {
    output += text;
  }
  return output;
}
