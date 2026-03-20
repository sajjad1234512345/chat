import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const ChatWindow = ({ senderId, receiverId }: { senderId: string, receiverId: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch initial messages
    supabase.from('messages')
      .select('*')
      .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // Subscribe to new messages
    const channel = supabase.channel('chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert({
      sender_id: senderId, receiver_id: receiverId, content: newMessage
    });
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-96 border border-white/10 rounded-xl p-4" role="log" aria-live="polite">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map(m => (
          <div key={m.id} className={`mb-2 ${m.sender_id === senderId ? 'text-right' : 'text-left'}`}>
            <span className="bg-zinc-800 p-2 rounded-lg">{m.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-zinc-800 p-2 rounded-lg"
          aria-label="اكتب رسالتك"
        />
        <button onClick={sendMessage} aria-label="إرسال">ارسال</button>
      </div>
    </div>
  );
};
