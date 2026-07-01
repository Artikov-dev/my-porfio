import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleReply = (data: { text: string }) => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.text,
        timestamp: new Date()
      }]);
    };

    socket.on('chat_reply', handleReply);

    return () => {
      socket.off('chat_reply', handleReply);
    };
  }, [socket]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setHasStarted(true);
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        text: `Hi ${name}! How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    
    // Emit to backend
    socket.emit('chat_message', {
      name,
      text: input
    });

    setInput('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] h-[450px] glass border border-border rounded-2xl flex flex-col overflow-hidden shadow-2xl origin-bottom-right animate-in zoom-in duration-300">
          {/* Header */}
          <div className="bg-primary/20 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-white">Live Chat</h3>
              <p className="text-xs text-primary/80">
                {hasStarted ? 'We typically reply in a few minutes' : 'Enter your name to start'}
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!hasStarted ? (
            /* Registration Form */
            <div className="flex-1 p-6 flex flex-col justify-center">
              <form onSubmit={handleStartChat} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-foreground/70 flex items-center gap-2">
                    <User className="w-4 h-4" /> Your Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-teal-500 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Start Chatting
                </button>
              </form>
            </div>
          ) : (
            /* Chat Interface */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <span className="text-[10px] text-primary/80 mb-1 ml-2 font-medium">Roma Artikov</span>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-br-sm' 
                          : 'bg-foreground/10 text-foreground rounded-bl-sm border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-border bg-background/50">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-background/50 border border-border rounded-full px-4 py-2 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2 bg-primary text-white rounded-full hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};
