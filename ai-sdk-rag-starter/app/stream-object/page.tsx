'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from '../api/use-object/schema';
import z from 'zod';
import { Bot, Loader2, Sparkles, StopCircle, Bell } from 'lucide-react';

export default function Page() {
  const { object, submit, isLoading, stop } = useObject({
    api: '/api/use-object',
    schema: z.array(notificationSchema),
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Stream Object</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time object streaming</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Generate Notifications
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Stream notifications in real-time with structured data
            </p>
            
            <button
              onClick={() => submit('Messages during finals week.')}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-3 mx-auto text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Notifications
                </>
              )}
            </button>
          </div>

          {/* Loading State with Stop Button */}
          {isLoading && (
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Streaming notifications...</span>
              </div>
              <button
                type="button"
                onClick={() => stop()}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                Stop
              </button>
            </div>
          )}

          {/* Notifications List */}
          {object && object.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-500" />
                Generated Notifications
              </h3>
              {object.map((notification, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      {notification?.name && (
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {notification.name}
                        </h4>
                      )}
                      {notification?.message && (
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {notification.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}