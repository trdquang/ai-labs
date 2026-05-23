'use client';

import { useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';

export default function Page() {
  const [generation, setGeneration] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);

    await fetch('/api/generate-object', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'Messages during finals week.',
      }),
    }).then(response => {
      response.json().then(json => {
        setGeneration(json.notifications);
        setIsLoading(false);
      });
    });
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Generate Object</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered object generation</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Generate Structured Data
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Click the button below to generate sample notifications
            </p>
            
            <button
              onClick={handleGenerate}
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
                  Generate Object
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {generation && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Generated Result
              </h3>
              <pre className="text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {JSON.stringify(generation, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}