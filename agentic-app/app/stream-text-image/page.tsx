'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png',
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    sendMessage({
      role: 'user',
      parts: [
        // check if imageUrl is defined, if so, add it to the message
        ...(imageUrl.trim().length > 0
          ? [
              {
                type: 'file' as const,
                mediaType: 'image/png',
                url: imageUrl,
              },
            ]
          : []),
        { type: 'text' as const, text: input },
      ],
    });
    setInput('');
    setImageUrl('');
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Image Chat</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chat with images and text</p>
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
                Welcome to Image Chat
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Send images with text prompts for AI analysis
              </p>
            </div>
          ) : (
            messages.map(m => (
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
                  {m.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div
                            key={`${m.id}-${i}`}
                            className={`px-4 py-3 rounded-2xl ${
                              m.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <p className="whitespace-pre-wrap leading-relaxed">{part.text}</p>
                          </div>
                        );
                      case 'file':
                        return (
                          <div
                            key={`${m.id}-${i}`}
                            className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg max-w-md"
                          >
                            <img
                              src={part.url}
                              alt={part.filename ?? 'image'}
                              className="w-full h-auto"
                            />
                          </div>
                        );
                      default:
                        return null;
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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="image-url"
                type="text"
                value={imageUrl}
                placeholder="Enter image URL..."
                onChange={e => setImageUrl(e.currentTarget.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="image-description"
                type="text"
                value={input}
                placeholder="What does the image show..."
                onChange={e => setInput(e.currentTarget.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
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