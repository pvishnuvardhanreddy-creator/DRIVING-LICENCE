import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Namaste! I am **RTO Sahayak AI**, your intelligent virtual transport assistant. How can I assist with your driving license, vehicle registration, or fee query today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What documents are needed for a Learner License?',
    'How do I transfer vehicle ownership (RC)?',
    'What is the fee for Permanent Driving License?',
    'What happens if I fail the practical driving test?',
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Thank you for reaching out. Please check our website FAQs or visit your local RTO.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('AI Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'bot',
          text: 'I am experiencing a slight connectivity issue. Please check your internet or retry in a moment.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full h-[600px] max-h-[90vh] flex flex-col border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex justify-between items-center border-b border-teal-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-emerald-400/40">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-bold text-sm flex items-center gap-1.5">
                RTO Sahayak AI <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </h2>
              <div className="text-[10px] text-emerald-200">Official Ministry Virtual Assistant</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 bg-emerald-700 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0A4D8C] text-white rounded-tr-none font-medium'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-gray-500 italic p-2 bg-white rounded-xl border border-gray-200 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>RTO Sahayak AI is retrieving official guidelines...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
          <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full whitespace-nowrap border border-emerald-200 font-medium transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about DL, RC, Rules, or Fees..."
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-1 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
