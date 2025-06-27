import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";

export default function EmbedChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [userMessage],
      }),
    });

    const data = await res.json();
    const assistantMessage = {
      role: "assistant",
      content: data.result || "No response from assistant.",
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <>
      <Head>
        <title>NBA CBA Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          html, body, #__next {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          @supports (height: 100dvh) {
            .nba-cba-chat-card {
              height: 100dvh !important;
            }
          }
          @media (max-width: 600px) {
            .nba-cba-chat-card {
              width: 100vw !important;
              max-width: 100vw !important;
              border-radius: 0 !important;
              border-left: none !important;
              border-right: none !important;
            }
          }
        `}</style>
      </Head>
      <div
        style={{
          background: "#ffe066",
          fontFamily: "'Instrument Sans', sans-serif",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          width: "100vw",
          boxSizing: "border-box",
        }}
      >
        <div
          className="nba-cba-chat-card"
          style={{
            background: "#fff",
            width: "100vw",
            maxWidth: 480,
            margin: "0 auto",
            borderRadius: 0,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            border: "3px solid #222",
            height: "100vh", // will be overridden by 100dvh if supported
            minHeight: 400,
            boxSizing: "border-box",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#222",
              color: "#ffe066",
              padding: "10px 0 6px 0",
              textAlign: "center",
              borderRadius: "9px 9px 0 0",
              fontWeight: 700,
              fontSize: "clamp(1.05rem, 2vw, 1.1rem)",
              letterSpacing: "0.3px",
              borderBottom: "2px solid #222",
              flexShrink: 0,
            }}
          >
            NBA CBA Assistant
            <div
              style={{
                fontWeight: 400,
                fontSize: "clamp(0.9rem, 1.8vw, 0.98rem)",
                color: "#fff7cc",
                marginTop: 1,
                letterSpacing: 0,
              }}
            >
              by Mitch Leblanc
            </div>
          </div>

          {/* WELCOME & BACK TO SITE */}
          <div
            style={{
              background: "#fff8dc",
              borderBottom: "1.5px solid #f1c40f",
              padding: "min(10px, 2vw) min(6vw, 20px)",
              fontSize: "clamp(0.97rem, 2vw, 1rem)",
              color: "#333",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <b>Ask anything about the NBA CBA, salary cap, or contract rules.</b>
            <div style={{ marginTop: 10 }}>
              <a
                href="https://mitchleblanc.xyz"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#222",
                  color: "#ffe066",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "clamp(0.95rem, 2vw, 1rem)",
                  marginTop: 8,
                  display: "inline-block",
                  transition: "background 0.15s",
                  width: "100%",
                  maxWidth: 250,
                }}
              >
                ← Back to Website
              </a>
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: "min(16px, 3vw)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "#fff",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#2563eb" : "#e5e7eb",
                  color: msg.role === "user" ? "white" : "#111827",
                  padding: "12px 14px",
                  borderRadius: 18,
                  maxWidth: "90vw",
                  fontSize: 14,
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            {isTyping && (
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                Assistant is reviewing the CBA… One moment.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              padding: "min(12px, 2.2vw)",
              borderTop: "1px solid #e5e7eb",
              background: "#fafafa",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 14,
                width: 0,
                minWidth: 0,
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about the NBA CBA…"
            />
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Send
            </button>
          </form>

          {/* FOOTER */}
          <div
            style={{
              background: "#fff",
              color: "#555",
              fontSize: "clamp(0.86rem, 1.5vw, 0.93rem)",
              textAlign: "center",
              padding: "7px 0 9px 0",
              borderRadius: "0 0 12px 12px",
              borderTop: "1px solid #f3e0a8",
              wordBreak: "break-word",
              flexShrink: 0,
            }}
          >
            &copy; {new Date().getFullYear()} Mitch Leblanc.<br />
            <span style={{ color: "#aaa" }}>
              For informational purposes only. Always consult the official NBA CBA for legal certainty.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
