import { useState } from 'react';

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] })
    });

    const data = await res.json();
    setMessages([...messages, userMessage, { role: 'assistant', content: data.result }]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ height: 400, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        style={{ width: '100%', padding: 10, marginTop: 10 }}
        placeholder="Ask something about the NBA CBA..."
      />
    </div>
  );
}
