import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';

export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: openai('gpt-4.1'),
    output: 'array',
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });

  return result.toTextStreamResponse();
}