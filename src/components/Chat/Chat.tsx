import { useState } from 'react';

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface ChatProps {
  pdfFile: File | null;
}

export const Chat = ({ pdfFile }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      setMessages([...messages, { type: 'user', content: question }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: 'Cette fonctionnalité sera implémentée avec le backend.' 
        }]);
      }, 1000);
      setQuestion('');
    }
  };

  return (
    <div className="w-[500px] flex-shrink-0">
      <div className="bg-white shadow rounded-lg flex flex-col h-[800px]">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Document Chat</h2>
          {pdfFile && (
            <p className="text-sm text-gray-500 mt-1">
              Analyzing: {pdfFile.name}
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleQuestionSubmit} className="p-4 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              placeholder={pdfFile ? "Ask a question about the document..." : "Upload a PDF first"}
              disabled={!pdfFile}
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!pdfFile}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
