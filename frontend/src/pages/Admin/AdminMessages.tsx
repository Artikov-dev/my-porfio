import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Mail, MessageCircle, Send, User } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

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

export const AdminMessages = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contacts' | 'chats'>('chats');
  
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const { socket } = useSocket();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get('/contact/messages');
        setContacts(data.data.contacts);
        setChats(data.data.chats);
      } catch (err) {
        console.error('Failed to fetch messages', err);
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

  // Group chats by session_id
  const chatSessions = chats.reduce((acc, chat) => {
    if (!acc[chat.session_id]) {
      acc[chat.session_id] = [];
    }
    acc[chat.session_id].push(chat);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  const handleReply = (e: React.FormEvent, sessionId: string) => {
    e.preventDefault();
    if (!replyText[sessionId] || !socket) return;

    socket.emit('admin_reply', {
      session_id: sessionId,
      text: replyText[sessionId]
    });

    setReplyText(prev => ({ ...prev, [sessionId]: '' }));
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
          Object.entries(chatSessions).map(([sessionId, sessionChats]) => {
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
                    disabled={!replyText[sessionId]}
                    className="bg-primary hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-primary text-white p-3 rounded-xl transition-colors"
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
