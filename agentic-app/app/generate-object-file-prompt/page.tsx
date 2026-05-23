'use client';

import { useState } from 'react';
import { Bot, Upload, FileText, Loader2 } from 'lucide-react';

export default function Page() {
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Generate Object from PDF</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload PDF to generate structured data</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <form
            action={async formData => {
              try {
                setLoading(true);
                const response = await fetch('/api/generate-object-file-prompt', {
                  method: 'POST',
                  body: formData,
                });
                setLoading(false);

                if (response.ok) {
                  setDescription(await response.text());
                }
              } catch (error) {
                console.error('Analysis failed:', error);
              }
            }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload PDF File
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Click to browse or drag and drop
                </span>
                <input
                  name="pdf"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  Analyze PDF
                </>
              )}
            </button>
          </form>

          {/* Results */}
          {description && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Analysis Result
              </h3>
              <pre className="text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                {JSON.stringify(JSON.parse(description), null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}