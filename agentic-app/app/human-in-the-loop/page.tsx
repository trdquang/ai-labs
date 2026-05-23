'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolUIPart, getToolName } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle, XCircle } from 'lucide-react';

export default function Chat() {
  const { messages, addToolResult, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/human-in-the-loop',
    }),
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Human-in-the-Loop</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Interactive AI with confirmation</p>
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
                Welcome to Human-in-the-Loop Demo
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try asking about the weather - you'll be asked to confirm before the tool runs
              </p>
              <div className="max-w-md mx-auto">
                <button
                  onClick={() => sendMessage({ text: "What's the weather in Paris?" })}
                  className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    What's the weather in Paris?
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
                    if (part.type === 'text') {
                      return (
                        <div
                          key={i}
                          className={`px-4 py-3 rounded-2xl ${
                            m.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{part.text}</p>
                        </div>
                      );
                    }
                    
                    if (isToolUIPart(part)) {
                      const toolName = getToolName(part);
                      const toolCallId = part.toolCallId;

                      // render confirmation tool (client-side tool with user interaction)
                      if (
                        toolName === 'getWeatherInformation' &&
                        part.state === 'input-available'
                      ) {
                        const { city } = part.input as { city: string };
                        return (
                          <div
                            key={toolCallId}
                            className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border-2 border-amber-200 dark:border-amber-700"
                          >
                            <p className="text-gray-900 dark:text-white mb-3 font-medium">
                              Get weather information for <span className="font-bold">{city}</span>?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  await addToolResult({
                                    toolCallId,
                                    tool: toolName,
                                    output: 'Yes, confirmed.',
                                  });
                                  sendMessage();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Yes
                              </button>
                              <button
                                onClick={async () => {
                                  await addToolResult({
                                    toolCallId,
                                    tool: toolName,
                                    output: 'No, denied.',
                                  });
                                  sendMessage();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                No
                              </button>
                            </div>
                          </div>
                        );
                      }
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
              onChange={e => setInput(e.target.value)}
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