import { openai } from '@ai-sdk/openai';
import {
  createUIMessageStreamResponse,
  createUIMessageStream,
  streamText,
  tool,
  convertToModelMessages,
  stepCountIs,
  isToolUIPart,
  getToolName,
  UIMessage,
} from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      // pull out last message
      const lastMessage = messages[messages.length - 1];

      lastMessage.parts = await Promise.all(
        // map through all message parts
        lastMessage.parts?.map(async part => {
          if (!isToolUIPart(part)) {
            return part;
          }
          const toolName = getToolName(part);
          // return if tool isn't weather tool or in a output-available state
          if (
            toolName !== 'getWeatherInformation' ||
            part.state !== 'output-available'
          ) {
            return part;
          }

          // switch through tool output states (set on the frontend)
          switch (part.output) {
            case 'Yes, confirmed.': {
              const result = await executeWeatherTool(
                part.input as { city: string },
              );

              // forward updated tool result to the client:
              writer.write({
                type: 'tool-output-available',
                toolCallId: part.toolCallId,
                output: result,
              });

              // update the message part:
              return { ...part, output: result };
            }
            case 'No, denied.': {
              const result = 'Error: User denied access to weather information';

              // forward updated tool result to the client:
              writer.write({
                type: 'tool-output-available',
                toolCallId: part.toolCallId,
                output: result,
              });

              // update the message part:
              return { ...part, output: result };
            }
            default:
              return part;
          }
        }) ?? [],
      );

      const result = streamText({
        model: openai('gpt-4o'),
        messages: convertToModelMessages(messages),
        tools: {
          getWeatherInformation: tool({
            description: 'show the weather in a given city to the user',
            inputSchema: z.object({ city: z.string() }),
            outputSchema: z.string(),
          }),
        },
        stopWhen: stepCountIs(5),
      });

      writer.merge(result.toUIMessageStream({ originalMessages: messages }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}

async function executeWeatherTool({ city }: { city: string }) {
  const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy'];
  return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
}