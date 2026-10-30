import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useI18n } from '@/contexts/I18nContext';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  // Only for the visitor's own messages: the server confirms each one it stored
  status?: 'sending' | 'sent' | 'failed';
}

interface StoredMessage {
  id: string;
  text: string;
  is_admin: boolean;
  created_at: string;
}

const UUID_ID = /^v_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage blocked — the chat still works for this page view
  }
};

// Unguessable: this id is the room admin replies are delivered to, and the key to the history.
// Older short ids are replaced, since the server only returns history for UUID ids.
const getVisitorId = () => {
  let id = readStorage('visitor_id');
  if (!id || !UUID_ID.test(id)) {
    id = 'v_' + crypto.randomUUID();
    writeStorage('visitor_id', id);
  }
  return id;
};

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  // The name is remembered, so a returning visitor goes straight back to their conversation
  const [name, setName] = useState(() => readStorage('chat_name') || '');
  const [hasStarted, setHasStarted] = useState(() => Boolean(readStorage('chat_name')));
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { socket } = useSocket();
  const { t } = useI18n();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    // 'nearest' keeps the page itself from jumping — only the chat list scrolls
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Restore the conversation (including admin replies sent while the visitor was away)
  useEffect(() => {
    if (!isOpen || !hasStarted || historyLoaded) return;
    setHistoryLoaded(true);
    api.get(`/contact/chat/${getVisitorId()}`, { timeout: 30000 })
      .then((res) => {
        const stored: StoredMessage[] = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (stored.length === 0) return;
        setMessages((prev) => [
          ...stored.map((m) => ({
            id: m.id,
            sender: m.is_admin ? 'bot' as const : 'user' as const,
            text: m.text,
            timestamp: new Date(m.created_at),
            status: m.is_admin ? undefined : 'sent' as const,
          })),
          // keep anything typed while the history was loading
          ...prev.filter((m) => m.id !== 'welcome' && !stored.some((s) => s.id === m.id)),
        ]);
      })
      .catch(() => {
        // backend asleep — the visitor can still chat
      });
  }, [isOpen, hasStarted, historyLoaded]);

  // Returning visitors see a greeting instead of an empty panel
  useEffect(() => {
    if (hasStarted && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        sender: 'bot',
        text: t('chat_welcome').replace('{name}', name.trim()),
        timestamp: new Date(),
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted]);

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

    const handleReply = (data: { id?: string; text: string }) => {
      setMessages(prev => prev.some(m => m.id === data.id) ? prev : [...prev, {
        id: data.id || crypto.randomUUID(),
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
      writeStorage('chat_name', name.trim());
      setHasStarted(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const text = input.trim();
    const localId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: localId, sender: 'user', text, timestamp: new Date(), status: 'sending' }]);
    setInput('');

    const setStatus = (status: ChatMessage['status']) =>
      setMessages(prev => prev.map(m => (m.id === localId ? { ...m, status } : m)));

    // socket.io buffers the emit while disconnected (e.g. backend cold start); the timeout
    // covers that wait too
    socket.timeout(30000).emit(
      'chat_message',
      { name: name.trim(), text, visitor_id: getVisitorId() },
      (err: Error | null, res?: { ok: boolean }) => setStatus(!err && res?.ok ? 'sent' : 'failed'),
    );
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
                    {msg.status === 'failed' && (
                      <span className="text-[10px] text-red-400 mt-1 mr-2">{t('chat_not_delivered')}</span>
                    )}
                    {msg.status === 'sending' && (
                      <span className="text-[10px] text-foreground/40 mt-1 mr-2">…</span>
                    )}
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
