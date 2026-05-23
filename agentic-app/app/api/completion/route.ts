import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    prompt,
  });

  return Response.json({ text });
}