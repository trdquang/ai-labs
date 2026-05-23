'use client';

import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../api/render-visual-interface-in-chat/route';
import { Send, Bot, User, Cloud, MapPin, CheckCircle, XCircle } from 'lucide-react';

/**
 * Visual Interface Chat Component
 * 
 * This component demonstrates how to create a chat interface that can render
 * custom visual components based on tool calls from the AI model. It handles
 * three types of tools:
 * 1. Server-side tools (like weather) - rendered with custom UI
 * 2. Client-side interactive tools (like confirmation) - shows buttons for user input
 * 3. Client-side auto-executed tools (like location) - runs automatically
 */
export default function Chat() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, addToolResult } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/render-visual-interface-in-chat',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
        addToolResult({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Visual Interface Chat</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dynamic UI rendering with tools</p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Welcome to Visual Interface Chat
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Ask about the weather to see custom UI rendering
              </p>
              <div className="max-w-md mx-auto">
                <button
                  onClick={() => sendMessage({ text: "What's the weather like?" })}
                  className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700"
                >
                  <Cloud className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    What's the weather like?
                  </p>
                </button>
              </div>
            </div>
          ) : (
            messages?.map(m => (
              <div
                key={m.id}
                className={`flex gap-4 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-3 max-w-[80%] ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {m.parts?.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div
                            key={m.id + i}
                            className={`px-4 py-3 rounded-2xl ${
                              m.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <p className="whitespace-pre-wrap leading-relaxed">{part.text}</p>
                          </div>
                        );

                      case 'tool-askForConfirmation':
                        return (
                          <div
                            key={part.toolCallId}
                            className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border-2 border-amber-200 dark:border-amber-700 w-full"
                          >
                            {part.state === 'output-available' ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {part.output}
                                </span>
                              </div>
                            ) : (
                              <>
                                <p className="text-gray-900 dark:text-white mb-3 font-medium">
                                  Please confirm to proceed
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                                    onClick={() =>
                                      addToolResult({
                                        tool: 'askForConfirmation',
                                        toolCallId: part.toolCallId,
                                        output: 'Yes, confirmed.',
                                      })
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Yes
                                  </button>
                                  <button
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                                    onClick={() =>
                                      addToolResult({
                                        tool: 'askForConfirmation',
                                        toolCallId: part.toolCallId,
                                        output: 'No, denied',
                                      })
                                    }
                                  >
                                    <XCircle className="w-4 h-4" />
                                    No
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );

                      case 'tool-getWeatherInformation':
                        if (part.state === 'output-available') {
                          return (
                            <div
                              key={part.toolCallId}
                              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg w-full"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <Cloud className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Weather Forecast</h3>
                              </div>
                              
                              <div className="bg-white/20 rounded-xl p-4 mb-4 backdrop-blur-sm">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm opacity-90">Current Temperature</p>
                                    <p className="text-5xl font-bold">
                                      {part.output.value}°
                                      {part.output.unit === 'celsius' ? 'C' : 'F'}
                                    </p>
                                  </div>
                                  <div className="h-16 w-16 bg-amber-400 rounded-full flex-shrink-0" />
                                </div>
                              </div>

                              <div className="flex gap-2 justify-between">
                                {part.output.weeklyForecast.map(forecast => (
                                  <div
                                    key={forecast.day}
                                    className="flex flex-col items-center bg-white/10 rounded-lg p-2 backdrop-blur-sm"
                                  >
                                    <div className="text-xs font-medium">{forecast.day}</div>
                                    <div className="text-lg font-bold">{forecast.value}°</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        break;

                      case 'tool-getLocation':
                        if (part.state === 'output-available') {
                          return (
                            <div
                              key={part.toolCallId}
                              className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl"
                            >
                              <MapPin className="w-5 h-5 text-blue-500" />
                              <span className="text-gray-700 dark:text-gray-300">
                                User is in <span className="font-bold">{part.output}</span>
                              </span>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={part.toolCallId}
                              className="flex items-center gap-2 px-4 py-3 text-gray-500 dark:text-gray-400"
                            >
                              <MapPin className="w-5 h-5 animate-pulse" />
                              <span>Getting location...</span>
                            </div>
                          );
                        }

                      default:
                        break;
                    }
                  })}
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.currentTarget.value)}
              placeholder="Ask about the weather..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}