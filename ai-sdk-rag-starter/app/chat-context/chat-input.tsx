import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { useSharedChatContext } from './chat-context';
import { Send, StopCircle } from 'lucide-react';

export default function ChatInput() {
  const { chat } = useSharedChatContext();
  const [text, setText] = useState('');
  const { status, stop, sendMessage } = useChat({ chat });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (text.trim() === '') return;
        sendMessage({ text });
        setText('');
      }}
    >
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Message chat..."
          disabled={status !== 'ready'}
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
        />
        {(status === 'streaming' || status === 'submitted') ? (
          <button
            type="button"
            onClick={stop}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <StopCircle className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim() || status !== 'ready'}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}