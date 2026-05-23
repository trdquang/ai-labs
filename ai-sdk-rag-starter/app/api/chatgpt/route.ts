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
 * Comprehensive tool set for ChatGPT-like experience
 * Includes various tools that can render dynamic UIs
 */
const tools = {
  /**
   * Weather Information Tool
   * Returns weather data that can be rendered in a table format
   */
  getWeather: tool({
    description: 'Get current weather information and forecast for a city',
    inputSchema: z.object({
      city: z.string().describe('The city to get weather for'),
      unit: z
        .enum(['celsius', 'fahrenheit'])
        .optional()
        .default('celsius')
        .describe('Temperature unit'),
    }),
    execute: async ({ city, unit }) => {
      // Mock weather data - in production, this would call a real weather API
      const currentTemp = unit === 'celsius' ? 24 : 75;
      const weatherData = {
        city,
        current: {
          temperature: currentTemp,
          unit,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          feelsLike: unit === 'celsius' ? 26 : 79,
        },
        forecast: [
          {
            day: 'Monday',
            high: unit === 'celsius' ? 26 : 79,
            low: unit === 'celsius' ? 18 : 64,
            condition: 'Sunny',
            precipitation: 0,
          },
          {
            day: 'Tuesday',
            high: unit === 'celsius' ? 27 : 81,
            low: unit === 'celsius' ? 19 : 66,
            condition: 'Partly Cloudy',
            precipitation: 10,
          },
          {
            day: 'Wednesday',
            high: unit === 'celsius' ? 25 : 77,
            low: unit === 'celsius' ? 17 : 63,
            condition: 'Cloudy',
            precipitation: 30,
          },
          {
            day: 'Thursday',
            high: unit === 'celsius' ? 23 : 73,
            low: unit === 'celsius' ? 16 : 61,
            condition: 'Rainy',
            precipitation: 70,
          },
          {
            day: 'Friday',
            high: unit === 'celsius' ? 24 : 75,
            low: unit === 'celsius' ? 17 : 63,
            condition: 'Partly Cloudy',
            precipitation: 20,
          },
        ],
      };
      return weatherData;
    },
  }),

  /**
   * Stock Information Tool
   * Returns stock data that can be rendered in a table
   */
  getStockInfo: tool({
    description: 'Get current stock information and recent performance',
    inputSchema: z.object({
      symbol: z.string().describe('Stock symbol (e.g., AAPL, GOOGL, MSFT)'),
    }),
    execute: async ({ symbol }) => {
      // Mock stock data - in production, this would call a real stock API
      const basePrice = Math.floor(Math.random() * 200) + 50;
      const change = (Math.random() - 0.5) * 10;
      
      return {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Inc.`,
        price: basePrice.toFixed(2),
        change: change.toFixed(2),
        changePercent: ((change / basePrice) * 100).toFixed(2),
        volume: '12.5M',
        marketCap: '2.8T',
        peRatio: '28.5',
        high52Week: (basePrice * 1.3).toFixed(2),
        low52Week: (basePrice * 0.7).toFixed(2),
        history: [
          { date: '5 days ago', price: (basePrice - 8).toFixed(2) },
          { date: '4 days ago', price: (basePrice - 5).toFixed(2) },
          { date: '3 days ago', price: (basePrice - 3).toFixed(2) },
          { date: '2 days ago', price: (basePrice - 1).toFixed(2) },
          { date: 'Yesterday', price: (basePrice + 2).toFixed(2) },
          { date: 'Today', price: basePrice.toFixed(2) },
        ],
      };
    },
  }),

  /**
   * Calculator Tool
   * Performs mathematical calculations
   */
  calculate: tool({
    description: 'Perform mathematical calculations',
    inputSchema: z.object({
      expression: z.string().describe('Mathematical expression to evaluate'),
    }),
    execute: async ({ expression }) => {
      try {
        // Simple evaluation - in production, use a proper math parser
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
        const result = eval(sanitized);
        return {
          expression,
          result: result.toString(),
          success: true,
        };
      } catch (error) {
        return {
          expression,
          result: 'Error',
          success: false,
          error: 'Invalid expression',
        };
      }
    },
  }),

  /**
   * Search Results Tool
   * Returns mock search results that can be rendered as cards
   */
  searchWeb: tool({
    description: 'Search the web for information',
    inputSchema: z.object({
      query: z.string().describe('Search query'),
    }),
    execute: async ({ query }) => {
      // Mock search results - in production, this would call a real search API
      return {
        query,
        results: [
          {
            title: `Understanding ${query} - Complete Guide`,
            url: `https://example.com/${query.toLowerCase().replace(/\s/g, '-')}`,
            snippet: `Learn everything about ${query}. This comprehensive guide covers all aspects including basics, advanced topics, and best practices.`,
            source: 'example.com',
          },
          {
            title: `${query} Best Practices in 2024`,
            url: `https://blog.example.com/${query.toLowerCase()}`,
            snippet: `Discover the latest best practices and trends related to ${query}. Updated for 2024 with expert insights.`,
            source: 'blog.example.com',
          },
          {
            title: `Top 10 Things About ${query}`,
            url: `https://news.example.com/articles/${query}`,
            snippet: `A curated list of the most important things you need to know about ${query}. Read now!`,
            source: 'news.example.com',
          },
        ],
      };
    },
  }),

  /**
   * Data Comparison Tool
   * Returns comparison data that can be rendered in a table
   */
  compareData: tool({
    description: 'Compare different items or options side by side',
    inputSchema: z.object({
      items: z.array(z.string()).describe('Items to compare'),
      category: z.string().describe('Category or context of comparison'),
    }),
    execute: async ({ items, category }) => {
      // Generate mock comparison data
      const features = ['Price', 'Quality', 'Performance', 'Support', 'Rating'];
      
      return {
        category,
        items: items.map(item => ({
          name: item,
          features: features.map(feature => ({
            feature,
            value: ['★'.repeat(Math.floor(Math.random() * 2) + 3) + '☆'.repeat(5 - Math.floor(Math.random() * 2) - 3)],
          })),
          pros: ['Great feature 1', 'Excellent feature 2'],
          cons: ['Minor issue 1'],
        })),
      };
    },
  }),
} satisfies ToolSet;

// Type definitions for the chat system
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

/**
 * POST handler for the ChatGPT API
 * Processes chat messages and streams responses with tool calls
 */
export async function POST(request: Request) {
  const { messages }: { messages: ChatMessage[] } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful AI assistant similar to ChatGPT. You can help users with various tasks including:
    - Getting weather information and forecasts
    - Looking up stock information
    - Performing calculations
    - Searching for information
    - Comparing different options
    
    When users ask for information that can be displayed visually (like weather, stocks, comparisons), 
    use the appropriate tools to provide rich, structured data that will be rendered in a beautiful UI.
    
    Be conversational, helpful, and use the tools when appropriate to enhance the user experience.`,
    messages: convertToModelMessages(messages),
    tools,
    maxSteps: 5,
  });

  return result.toUIMessageStreamResponse();
}

