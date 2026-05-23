'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useState, useEffect } from 'react';
import { Send, Bot, User, Paperclip, X } from 'lucide-react';

async function convertFilesToDataURLs(
  files: FileList,
): Promise<
  { type: 'file'; filename: string; mediaType: string; url: string }[]
> {
  return Promise.all(
    Array.from(files).map(
      file =>
        new Promise<{
          type: 'file';
          filename: string;
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: 'file',
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string, // Data URL
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    ),
  );
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat-pdf',
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && (!files || files.length === 0)) return;

    const fileParts =
      files && files.length > 0
        ? await convertFilesToDataURLs(files)
        : [];

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: input }, ...fileParts],
    });

    setFiles(undefined);
    setInput('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chat PDF</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload and chat with your documents</p>
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
                Welcome to Chat PDF
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Upload PDF files and ask questions about them
              </p>
            </div>
          ) : (
            messages.map(message => (
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
                  {message.parts.map((part, i) => {
                    if (part.type === 'text') {
                      return (
                        <div
                          key={`${message.id}-${i}`}
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
                    if (part.type === 'file') {
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm"
                        >
                          <Paperclip className="w-4 h-4" />
                          <span className="font-medium">{part.filename}</span>
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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* File Preview */}
          {files && files.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {Array.from(files).map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="font-medium">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles(undefined);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="file"
              onChange={event => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer transition-colors flex items-center justify-center"
            >
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your documents..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={!input.trim() && (!files || files.length === 0)}
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