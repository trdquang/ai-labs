import { openai } from '@ai-sdk/openai';
import {
  type InferUITools,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from 'ai';
import { z } from 'zod';

/**
 * Tool definitions for the visual interface chat demo.
 * This demonstrates three different types of tools:
 * 1. Server-side tools that execute on the backend
 * 2. Client-side tools that require user interaction
 * 3. Client-side tools that execute automatically
 */
const tools = {
  /**
   * Server-side tool: Weather information fetcher
   * This tool executes on the server and returns mock weather data.
   * The client will render this data in a custom visual component.
   */
  getWeatherInformation: tool({
    description: 'show the weather in a given city to the user',
    inputSchema: z.object({ city: z.string() }),
    execute: async ({}: { city: string }) => {
      // Mock weather data - in a real app, this would call a weather API
      return {
        value: 24,
        unit: 'celsius',
        weeklyForecast: [
          { day: 'Monday', value: 24 },
          { day: 'Tuesday', value: 25 },
          { day: 'Wednesday', value: 26 },
          { day: 'Thursday', value: 27 },
          { day: 'Friday', value: 28 },
          { day: 'Saturday', value: 29 },
          { day: 'Sunday', value: 30 },
        ],
      };
    },
  }),
  
  /**
   * Client-side tool: User confirmation dialog
   * This tool doesn't execute on the server. Instead, it triggers
   * a user interaction on the client side (Yes/No buttons).
   * The client handles the tool execution and sends the result back.
   */
  askForConfirmation: tool({
    description: 'Ask the user for confirmation.',
    inputSchema: z.object({
      message: z.string().describe('The message to ask for confirmation.'),
    }),
  }),
  
  /**
   * Client-side tool: Location getter (auto-executed)
   * This tool is automatically executed on the client side without
   * user interaction. The client handles the execution and returns
   * a random city as mock location data.
   */
  getLocation: tool({
    description:
      'Get the user location. Always ask for confirmation before using this tool.',
    inputSchema: z.object({}),
  }),
} satisfies ToolSet;

// Type definitions for the chat system
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

/**
 * POST handler for the visual interface chat API
 * This endpoint processes chat messages and streams responses with tool calls
 * that can render custom visual components on the client side.
 */
export async function POST(request: Request) {
  // Extract messages from the request body
  const { messages }: { messages: ChatMessage[] } = await request.json();

  // Create a streaming text response with tool support
  const result = streamText({
    model: openai('gpt-4.1'), // Use GPT-4.1 model for responses
    messages: convertToModelMessages(messages), // Convert UI messages to model format
    tools, // Provide the tool definitions to the model
    stopWhen: stepCountIs(5), // Stop after 5 steps to prevent infinite loops
  });

  // Return the response as a UI message stream
  // This allows the client to receive both text and tool call data
  return result.toUIMessageStreamResponse();
}