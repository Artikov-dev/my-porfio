import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useI18n } from '@/contexts/I18nContext';
import toast from 'react-hot-toast';

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
  const { t } = useI18n();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getVisitorId = () => {
    let id = localStorage.getItem('visitor_id');
    if (!id) {
      // Unguessable: this id is the room that admin replies are delivered to
      id = 'v_' + crypto.randomUUID();
      localStorage.setItem('visitor_id', id);
    }
    return id;
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    // 'nearest' keeps the page itself from jumping — only the chat list scrolls
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Re-join on every (re)connect — e.g. after the backend wakes from a cold start —
    // otherwise admin replies sent to this visitor's room would be lost
    const joinRoom = () => socket.emit('join_room', getVisitorId());
    joinRoom();
    socket.on('connect', joinRoom);

    const handleError = (data: { message?: string }) => {
      toast.error(data?.message || 'Message not sent');
    };
    socket.on('chat_error', handleError);

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
      socket.off('connect', joinRoom);
      socket.off('chat_error', handleError);
    };
  }, [socket]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setHasStarted(true);
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        text: t('chat_welcome').replace('{name}', name.trim()),
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
    
    // Emit to backend with persistent visitor_id
    socket.emit('chat_message', {
      name,
      text: input,
      visitor_id: getVisitorId()
    });

    setInput('');
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[60] flex flex-col items-end">
      {isOpen && (
        <div
          role="dialog"
          aria-label={t('chat_title')}
          // max-h keeps the panel below the fixed navbar on short / landscape phones
          className="mb-4 w-[calc(100vw-2rem)] sm:w-[350px] h-[450px] max-h-[calc(100dvh-12rem)] glass border border-border rounded-2xl flex flex-col overflow-hidden shadow-2xl origin-bottom-right animate-in zoom-in duration-300"
        >
          {/* Header */}
          <div className="bg-primary/20 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-foreground dark:text-white">{t('chat_title')}</h3>
              <p className="text-xs text-primary/80">
                {hasStarted ? t('chat_reply_time') : t('chat_enter_name')}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label={t('chat_close')}
              className="text-foreground/60 dark:text-white/60 hover:text-foreground dark:hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!hasStarted ? (
            /* Registration Form */
            <div className="flex-1 p-6 flex flex-col justify-center">
              <form onSubmit={handleStartChat} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="livechat-name" className="text-sm text-foreground/70 flex items-center gap-2">
                    <User className="w-4 h-4" /> {t('chat_your_name')}
                  </label>
                  {/* text-base (16px) on mobile: smaller inputs make iOS Safari auto-zoom on focus */}
                  <input
                    id="livechat-name"
                    type="text"
                    required
                    maxLength={50}
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-base sm:text-sm text-foreground dark:text-white focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-accent-hover text-white font-medium py-2 rounded-lg transition-colors"
                >
                  {t('chat_start')}
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
                    maxLength={1000}
                    aria-label={t('chat_placeholder')}
                    onChange={e => setInput(e.target.value)}
                    placeholder={t('chat_placeholder')}
                    className="flex-1 bg-background/50 border border-border rounded-full px-4 py-2 text-base sm:text-sm text-foreground dark:text-white focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label={t('chat_send')}
                    disabled={!input.trim()}
                    className="p-2 bg-primary text-white rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        aria-label={isOpen ? t('chat_close') : t('chat_open')}
        aria-expanded={isOpen}
        className="w-12 h-12 md:w-14 md:h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(94,142,203,0.35)] hover:scale-105 hover:shadow-[0_0_30px_rgba(94,142,203,0.55)] transition-all duration-300"
      >
        {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />}
      </button>
    </div>
  );
};
