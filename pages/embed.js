// pages/embed.js
import { useState, useEffect, useRef } from 'react';

export default function EmbedChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: 'assistant', content: data.output }]);
    setIsTyping(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                ...(msg.role === 'user' ? styles.user : styles.assistant),
              }}
            >
              {msg.content}
            </div>
          ))}
          {isTyping && <div style={styles.typing}>Assistant is typing…</div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} style={styles.inputContainer}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the NBA CBA…"
          />
          <button style={styles.button} type="submit">Send</button>
        </form>
      </div>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Sans&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}

const styles = {
  page: {
    margin: 0,
    padding: 0,
    height: '100vh',
    fontFamily: '"Instrument Sans", sans-serif',
    background: '#f4f4f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBox: {
    background: 'white',
    width: '100%',
    maxWidth: 480,
    height: '90vh',
    borderRadius: 12,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  bubble: {
    padding: '12px 14px',
    borderRadius: 18,
    maxWidth: '80%',
    fontSize: 14,
    lineHeight: 1.4,
  },
  user: {
    alignSelf: 'flex-end',
    background: '#2563eb',
    color: 'white',
  },
  assistant: {
    alignSelf: 'flex-start',
    background: '#e5e7eb',
    color: '#111827',
  },
  inputContainer: {
    display: 'flex',
    padding: 12,
    borderTop: '1px solid #e5e7eb',
    background: '#fafafa',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    marginLeft: 8,
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  typing: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
};
