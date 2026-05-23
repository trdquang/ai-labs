'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../api/chatgpt/route';
import { Send, Bot, User, Cloud, TrendingUp, Calculator, Search, BarChart } from 'lucide-react';

/**
 * ChatGPT-like Interface Component
 * Features dynamic UI rendering based on AI tool responses
 */
export default function ChatGPTPage() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chatgpt',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  // Auto-scroll to bottom when new messages arrive
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">ChatGPT</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI Assistant with Dynamic UI</p>
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
                Welcome to ChatGPT
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try asking about weather, stocks, calculations, or search for information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => sendMessage({ text: "What's the weather like in New York?" })}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700"
                >
                  <Cloud className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Weather in New York
                  </p>
                </button>
                <button
                  onClick={() => sendMessage({ text: 'Get stock info for AAPL' })}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700"
                >
                  <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Apple Stock Info
                  </p>
                </button>
                <button
                  onClick={() => sendMessage({ text: 'Calculate 234 * 567' })}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700"
                >
                  <Calculator className="w-5 h-5 text-purple-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Math Calculation
                  </p>
                </button>
                <button
                  onClick={() => sendMessage({ text: 'Search for React best practices' })}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700"
                >
                  <Search className="w-5 h-5 text-orange-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Web Search
                  </p>
                </button>
              </div>
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
                  {message.parts?.map((part, i) => {
                    switch (part.type) {
                      case 'text':
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

                      // Weather Tool Renderer
                      case 'tool-getWeather':
                        if (part.state === 'output-available') {
                          const weather = part.output;
                          return (
                            <div
                              key={part.toolCallId}
                              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg w-full"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <Cloud className="w-6 h-6" />
                                <h3 className="text-xl font-bold">{weather.city}</h3>
                              </div>
                              
                              {/* Current Weather */}
                              <div className="bg-white/20 rounded-xl p-4 mb-4 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm opacity-90">Current Temperature</p>
                                    <p className="text-4xl font-bold">
                                      {weather.current.temperature}°
                                      {weather.current.unit === 'celsius' ? 'C' : 'F'}
                                    </p>
                                    <p className="text-sm opacity-90">{weather.current.condition}</p>
                                  </div>
                                  <div className="text-right text-sm">
                                    <p>Feels like: {weather.current.feelsLike}°</p>
                                    <p>Humidity: {weather.current.humidity}%</p>
                                    <p>Wind: {weather.current.windSpeed} km/h</p>
                                  </div>
                                </div>
                              </div>

                              {/* Forecast Table */}
                              <div className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                                <table className="w-full">
                                  <thead className="bg-white/20">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-sm font-semibold">Day</th>
                                      <th className="px-4 py-2 text-left text-sm font-semibold">High/Low</th>
                                      <th className="px-4 py-2 text-left text-sm font-semibold">Condition</th>
                                      <th className="px-4 py-2 text-left text-sm font-semibold">Rain</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {weather.forecast.map((day, idx) => (
                                      <tr
                                        key={idx}
                                        className="border-t border-white/10 hover:bg-white/10 transition-colors"
                                      >
                                        <td className="px-4 py-3">{day.day}</td>
                                        <td className="px-4 py-3">
                                          {day.high}° / {day.low}°
                                        </td>
                                        <td className="px-4 py-3">{day.condition}</td>
                                        <td className="px-4 py-3">{day.precipitation}%</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        }
                        break;

                      // Stock Tool Renderer
                      case 'tool-getStockInfo':
                        if (part.state === 'output-available') {
                          const stock = part.output;
                          const isPositive = parseFloat(stock.change) > 0;
                          
                          return (
                            <div
                              key={part.toolCallId}
                              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-6 h-6 text-green-500" />
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stock.symbol}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
                                </div>
                              </div>

                              {/* Price and Change */}
                              <div className="mb-6">
                                <div className="flex items-baseline gap-3">
                                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                    ${stock.price}
                                  </span>
                                  <span
                                    className={`text-xl font-semibold ${
                                      isPositive ? 'text-green-500' : 'text-red-500'
                                    }`}
                                  >
                                    {isPositive ? '+' : ''}
                                    {stock.change} ({stock.changePercent}%)
                                  </span>
                                </div>
                              </div>

                              {/* Stock Details Table */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    ${stock.marketCap}
                                  </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {stock.volume}
                                  </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">P/E Ratio</p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {stock.peRatio}
                                  </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">52W Range</p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    ${stock.low52Week} - ${stock.high52Week}
                                  </p>
                                </div>
                              </div>

                              {/* Price History */}
                              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Recent History
                                </h4>
                                <div className="space-y-1">
                                  {stock.history.map((entry, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                                    >
                                      <span>{entry.date}</span>
                                      <span className="font-mono">${entry.price}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        break;

                      // Calculator Tool Renderer
                      case 'tool-calculate':
                        if (part.state === 'output-available') {
                          const calc = part.output;
                          return (
                            <div
                              key={part.toolCallId}
                              className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <Calculator className="w-6 h-6" />
                                <h3 className="text-lg font-bold">Calculator</h3>
                              </div>
                              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm opacity-90 mb-2">Expression:</p>
                                <p className="text-xl font-mono mb-4">{calc.expression}</p>
                                <p className="text-sm opacity-90 mb-2">Result:</p>
                                <p className="text-4xl font-bold font-mono">{calc.result}</p>
                              </div>
                            </div>
                          );
                        }
                        break;

                      // Search Tool Renderer
                      case 'tool-searchWeb':
                        if (part.state === 'output-available') {
                          const search = part.output;
                          return (
                            <div key={part.toolCallId} className="w-full space-y-3">
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Search className="w-5 h-5" />
                                <p className="text-sm font-semibold">Search results for: {search.query}</p>
                              </div>
                              {search.results.map((result, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                >
                                  <a
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-1">
                                      {result.title}
                                    </h4>
                                    <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                                      {result.source}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {result.snippet}
                                    </p>
                                  </a>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        break;

                      // Compare Tool Renderer
                      case 'tool-compareData':
                        if (part.state === 'output-available') {
                          const comparison = part.output;
                          return (
                            <div
                              key={part.toolCallId}
                              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-x-auto"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <BarChart className="w-6 h-6 text-orange-500" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {comparison.category} Comparison
                                </h3>
                              </div>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                                    <th className="px-4 py-2 text-left">Feature</th>
                                    {comparison.items.map((item, idx) => (
                                      <th key={idx} className="px-4 py-2 text-left">
                                        {item.name}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {comparison.items[0]?.features.map((_, featureIdx) => (
                                    <tr
                                      key={featureIdx}
                                      className="border-b border-gray-200 dark:border-gray-700"
                                    >
                                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        {comparison.items[0].features[featureIdx].feature}
                                      </td>
                                      {comparison.items.map((item, itemIdx) => (
                                        <td key={itemIdx} className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                          {item.features[featureIdx].value}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        }
                        break;

                      default:
                        break;
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
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message ChatGPT..."
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

