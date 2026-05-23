'use client';

import type { ModelMessage } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function GenerateTextChatPromptPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ModelMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && input.trim()) {
            const userMessage: ModelMessage = { role: 'user', content: input };
            setMessages(currentMessages => [...currentMessages, userMessage]);

            const response = await fetch('/api/generate-text-chat-prompt', {
                method: 'POST',
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            const { messages: newMessages } = await response.json();

            setMessages(currentMessages => [...currentMessages, ...newMessages]);
            setInput('');
        }
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
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Generate Text Chat</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Chat-based text generation</p>
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
                                Welcome to Generate Text Chat
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Start a conversation to generate text responses
                            </p>
                        </div>
                    ) : (
                        messages.map((message, index) => {
                            const isUser = message.role === 'user';
                            let textContent = '';
                            
                            if (typeof message.content === 'string') {
                                textContent = message.content;
                            } else {
                                textContent = message.content
                                    .filter(part => part.type === 'text')
                                    .map(part => part.text)
                                    .join(' ');
                            }

                            return (
                                <div
                                    key={`${message.role}-${index}`}
                                    className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    {!isUser && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    )}

                                    <div
                                        className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                                            isUser
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{textContent}</p>
                                    </div>

                                    {isUser && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message and press Enter..."
                    />
                    <button
                        onClick={() => handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any)}
                        disabled={!input.trim()}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}