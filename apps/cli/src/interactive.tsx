import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import type { Agent } from "@tansui/core";
import type { AgentEvent } from "@tansui/types";
import { createId, toErrorInfo } from "@tansui/share";

type MessageRole = "user" | "agent" | "system";

type Message = {
  id: string;
  role: MessageRole;
  text: string;
};

const MAX_MESSAGES = 60;

function createMessage(role: MessageRole, text: string): Message {
  return { id: createId("msg"), role, text };
}

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function extractOutputText(output: unknown): string | undefined {
  if (typeof output === "string") {
    return output;
  }
  if (output && typeof output === "object" && "text" in output) {
    const text = (output as { text?: unknown }).text;
    if (typeof text === "string") {
      return text;
    }
  }
  return undefined;
}

function extractErrorText(data: unknown): string {
  if (data && typeof data === "object") {
    if ("error" in data && typeof (data as { error?: unknown }).error === "string") {
      return (data as { error: string }).error;
    }
    if ("message" in data && typeof (data as { message?: unknown }).message === "string") {
      return (data as { message: string }).message;
    }
  }
  return formatValue(data);
}

function eventsToMessages(events: AgentEvent[]): Message[] {
  const messages: Message[] = [];
  for (const event of events) {
    if (event.type === "result") {
      const data = event.data as { text?: unknown } | undefined;
      const text =
        typeof data?.text === "string" ? data.text : formatValue(event.data);
      messages.push(createMessage("agent", text));
      continue;
    }

    if (event.type === "observation") {
      const data = event.data as { output?: unknown } | undefined;
      const output = data?.output;
      const text = extractOutputText(output);
      messages.push(
        createMessage("agent", text ?? `Tool output: ${formatValue(output)}`)
      );
      continue;
    }

    if (event.type === "error") {
      messages.push(createMessage("system", `Error: ${extractErrorText(event.data)}`));
    }
  }
  return messages;
}

function roleLabel(role: MessageRole): string {
  if (role === "user") {
    return "You";
  }
  if (role === "agent") {
    return "Agent";
  }
  return "System";
}

function roleColor(role: MessageRole): "green" | "cyan" | "red" {
  if (role === "user") {
    return "green";
  }
  if (role === "agent") {
    return "cyan";
  }
  return "red";
}

type ChatAppProps = {
  agent: Agent;
  notice?: string;
};

function ChatApp({ agent, notice }: ChatAppProps): JSX.Element {
  const { exit } = useApp();
  const sessionId = useRef(createId("session"));
  const [messages, setMessages] = useState<Message[]>(() =>
    notice ? [createMessage("system", notice)] : []
  );
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const handle = setInterval(() => {
      setCursorVisible((visible) => !visible);
    }, 500);
    return () => {
      clearInterval(handle);
    };
  }, []);

  const appendMessages = useCallback((next: Message[]) => {
    setMessages((prev) => {
      const combined = [...prev, ...next];
      return combined.length > MAX_MESSAGES
        ? combined.slice(-MAX_MESSAGES)
        : combined;
    });
  }, []);

  const submitDraft = useCallback(async () => {
    const text = draft.trim();
    if (!text || pending) {
      return;
    }
    setDraft("");
    appendMessages([createMessage("user", text)]);
    setPending(true);
    try {
      const events = await agent.run(text, sessionId.current);
      const next = eventsToMessages(events);
      if (next.length > 0) {
        appendMessages(next);
      }
    } catch (error) {
      appendMessages([createMessage("system", `Error: ${toErrorInfo(error).message}`)]);
    } finally {
      setPending(false);
    }
  }, [agent, appendMessages, draft, pending]);

  useInput((input, key) => {
    if (key.escape || (key.ctrl && input === "c")) {
      exit();
      return;
    }
    if (pending) {
      return;
    }
    if (key.return) {
      void submitDraft();
      return;
    }
    if (key.backspace || key.delete) {
      setDraft((prev) => prev.slice(0, -1));
      return;
    }
    if (key.ctrl || key.meta) {
      return;
    }
    if (input) {
      setDraft((prev) => prev + input);
    }
  });

  const visibleMessages = messages.length === 0 ? [] : messages;

  return (
    <Box flexDirection="column" padding={1}>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
        paddingY={0}
        minHeight={10}
      >
        {visibleMessages.length === 0 ? (
          <Text color="gray">Start a conversation.</Text>
        ) : (
          visibleMessages.map((message) => (
            <Box key={message.id} flexDirection="row">
              <Text color={roleColor(message.role)}>{roleLabel(message.role)}:</Text>
              <Text> {message.text}</Text>
            </Box>
          ))
        )}
      </Box>
      <Box marginTop={1} borderStyle="round" borderColor="cyan" paddingX={1}>
        <Text color="green">You:</Text>
        <Text> {draft}</Text>
        {pending ? (
          <Text color="gray"> ...</Text>
        ) : (
          <Text color="gray">{cursorVisible ? "|" : " "}</Text>
        )}
      </Box>
      <Text color="gray">
        {pending ? "Agent is thinking..." : "Enter to send | Esc/Ctrl+C to exit"}
      </Text>
    </Box>
  );
}

export async function runInteractive(
  agent: Agent,
  options: { notice?: string } = {}
): Promise<number> {
  const { waitUntilExit } = render(
    <ChatApp agent={agent} notice={options.notice} />
  );
  await waitUntilExit();
  return 0;
}
