import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

const messageStore = new Map<string, UIMessage[]>();

async function saveMessages(id: string, messages: UIMessage[]) {
  messageStore.set(id, messages);
}

async function loadMessages(id: string): Promise<UIMessage[]> {
  return messageStore.get(id) ?? [];
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { id, message } = await req.json();

  // Load existing messages and add the new one
  const messages = await loadMessages(id);
  messages.push(message);

  // Call the language model
  const result = streamText({
    model: openai('gpt-4.1'),
    messages: convertToModelMessages(messages),
  });

  // Respond with the stream
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages: newMessages }) => {
      saveMessages(id, newMessages);
    },
  });
}