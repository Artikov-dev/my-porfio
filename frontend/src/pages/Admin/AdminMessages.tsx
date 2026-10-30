import React, { useEffect, useState } from 'react';
import { api, refreshSession } from '@/lib/api';
import { Mail, MessageCircle, Send, User } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import type { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  location: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  name: string;
  text: string;
  session_id: string;
  created_at: string;
  is_admin?: boolean;
}

type ReplyResult = { ok: boolean; reason?: string };

const REPLY_ERRORS: Record<string, string> = {
  unauthorized: 'Session expired — please log in again to reply.',
  timeout: 'The server did not confirm the reply. Check the connection and try again.',
  invalid: 'Reply is empty or the chat session is invalid.',
  server: 'Reply could not be saved on the server.',
};

// The server acknowledges every admin_reply, so a rejected or lost reply is reported
const emitReply = (socket: Socket, payload: { session_id: string; text: string }) =>
  new Promise<ReplyResult>((resolve) => {
    socket.timeout(10000).emit('admin_reply', payload, (err: Error | null, res?: ReplyResult) => {
      resolve(err || !res ? { ok: false, reason: 'timeout' } : res);
    });
  });

const reconnect = (socket: Socket) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('reconnect timeout')), 15000);
    socket.once('connect', () => {
      clearTimeout(timer);
      resolve();
    });
    socket.disconnect().connect();
  });

export const AdminMessages = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'chats'>('chats');

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Longer than the default 6s: the first request may wake the backend from a cold start
        const res = await api.get('/contact/messages', { timeout: 30000 });
        if (res?.data?.data) {
          setContacts(res.data.data.contacts || []);
          setChats(res.data.data.chats || []);
        }
      } catch {
        // Shown as an error, not as an empty inbox that looks like "no messages"
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    // Listen for new messages (both user and admin replies)
    const handleNewMessage = (newMsg: ChatMessage) => {
      setChats(prev => {
        // Prevent duplicates
        if (prev.some(c => c.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    };

    socket.on('new_admin_message', handleNewMessage);
    
    return () => {
      socket.off('new_admin_message', handleNewMessage);
    };
  }, [socket]);

  if (loading) {
    return <div className="text-foreground dark:text-white">Loading messages...</div>;
  }

  if (loadError) {
    return (
      <div className="text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4">
        Could not load messages — the server or database is unavailable. Try again in a moment.
      </div>
    );
  }

  // Group chats by session_id
  const chatSessions = chats.reduce((acc, chat) => {
    if (!acc[chat.session_id]) {
      acc[chat.session_id] = [];
    }
    acc[chat.session_id].push(chat);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  const handleReply = async (e: React.FormEvent, sessionId: string) => {
    e.preventDefault();
    const text = replyText[sessionId]?.trim();
    if (!text || !socket || sendingTo) return;

    setSendingTo(sessionId);
    const payload = { session_id: sessionId, text };
    let result = await emitReply(socket, payload);

    // The socket's admin rights end with the access token it connected with. Refresh the
    // session, reconnect so the handshake carries the new cookie, and try once more.
    if (!result.ok && result.reason === 'unauthorized') {
      try {
        await refreshSession();
        await reconnect(socket);
        result = await emitReply(socket, payload);
      } catch {
        result = { ok: false, reason: 'unauthorized' };
      }
    }
    setSendingTo(null);

    if (result.ok) {
      setReplyText(prev => ({ ...prev, [sessionId]: '' }));
    } else {
      // The typed reply stays in the input so nothing is lost
      toast.error(REPLY_ERRORS[result.reason ?? ''] ?? REPLY_ERRORS.server);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <button 
          onClick={() => setActiveTab('chats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'chats' ? 'bg-primary text-white' : 'text-foreground/60 hover:text-white'
          }`}
        >
          <MessageCircle className="w-5 h-5" /> Live Chat Sessions
          <span className="bg-foreground/10 px-2 py-0.5 rounded-full text-xs">{Object.keys(chatSessions).length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'contacts' ? 'bg-primary text-white' : 'text-foreground/60 hover:text-white'
          }`}
        >
          <Mail className="w-5 h-5" /> Contact Form Submissions
          <span className="bg-foreground/10 px-2 py-0.5 rounded-full text-xs">{contacts.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'chats' && (
          Object.keys(chatSessions).length === 0 ? <p className="text-foreground/50">No chat sessions yet.</p> :
          // Messages inside a session are oldest-first; sessions themselves: most recent activity first
          Object.entries(chatSessions)
            .sort(([, a], [, b]) => Date.parse(b[b.length - 1].created_at) - Date.parse(a[a.length - 1].created_at))
            .map(([sessionId, sessionChats]) => {
            const userName = sessionChats.find(c => !c.is_admin)?.name || 'Visitor';
            return (
              <div key={sessionId} className="glass p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground dark:text-white text-lg">{userName}</h4>
                    <p className="text-xs text-foreground/50 font-mono">Session: {sessionId.slice(0,8)}...</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {sessionChats.map(chat => (
                    <div key={chat.id} className={`flex flex-col ${chat.is_admin ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                        chat.is_admin 
                          ? 'bg-primary text-white rounded-tr-sm' 
                          : 'bg-foreground/10 text-foreground/90 rounded-tl-sm border border-white/5'
                      }`}>
                        <p className="text-sm">{chat.text}</p>
                      </div>
                      <span className="text-[10px] text-foreground/40 mt-1 px-1">
                        {new Date(chat.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => handleReply(e, sessionId)} className="flex gap-2 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    value={replyText[sessionId] || ''}
                    onChange={e => setReplyText(prev => ({ ...prev, [sessionId]: e.target.value }))}
                    className="flex-1 bg-black/30 border border-border rounded-xl px-4 text-sm text-foreground dark:text-white focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="submit"
                    disabled={!replyText[sessionId]?.trim() || sendingTo !== null}
                    className="bg-primary hover:bg-accent-hover disabled:opacity-50 disabled:hover:bg-primary text-white p-3 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            );
          })
        )}

        {activeTab === 'contacts' && (
          contacts.length === 0 ? <p className="text-foreground/50">No contact submissions yet.</p> :
          contacts.map(contact => (
            <div key={contact.id} className="glass p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-foreground dark:text-white text-lg">{contact.name}</h4>
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline text-sm flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {contact.email}
                  </a>
                </div>
                <span className="text-xs text-foreground/50 bg-background/50 px-3 py-1 rounded-full">
                  {new Date(contact.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md">{contact.location}</span>
                <span>Subject: {contact.subject}</span>
              </div>
              <p className="text-foreground/80 mt-2 bg-background/30 p-4 rounded-xl border border-white/5 leading-relaxed">
                {contact.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
