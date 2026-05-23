'use client';

import { useChat } from '@ai-sdk/react';
import { useSharedChatContext } from './chat-context';
import ChatInput from './chat-input';
import { useRef, useEffect } from 'react';
import { Bot, User, Trash2 } from 'lucide-react';

export default function Chat() {
  const { chat, clearChat } = useSharedChatContext();
  const { messages } = useChat({
    chat,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chat Context Demo</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Shared chat context example</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            disabled={messages.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Welcome to Chat Context Demo
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Start chatting to see shared context in action
              </p>
            </div>
          ) : (
            messages?.map(message => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return (
                        <div
                          key={index}
                          className={`px-4 py-3 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{part.text}</p>
                        </div>
                      );
                    }
                  })}
                </div>

                {message.role === 'user' && (
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
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}