// pages/embed.js
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown"; // ✅ Markdown renderer

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
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          background: "#ffe066", // Brand yellow
          fontFamily: "'Instrument Sans', sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            width: "100%",
            maxWidth: 480,
            height: "90vh",
            borderRadius: 12,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "3px solid #222",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#222",
              color: "#ffe066",
              padding: "18px 0 10px 0",
              textAlign: "center",
              borderRadius: "9px 9px 0 0",
              fontWeight: 700,
              fontSize: "1.4rem",
              letterSpacing: "0.5px",
              borderBottom: "2px solid #222",
            }}
          >
            NBA CBA Assistant
            <div
              style={{
                fontWeight: 400,
                fontSize: "1.05rem",
                color: "#fff7cc",
                marginTop: 2,
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
              padding: "12px 22px",
              fontSize: "1rem",
              color: "#333",
              textAlign: "center",
            }}
          >
            <b>Ask anything about the NBA CBA, salary cap, or contract rules.</b>
            <br />
            <span style={{ color: "#b8860b" }}>
              Fast, accurate answers for front offices, agents, and fans.
            </span>
            <div style={{ marginTop: 12 }}>
              <a
                href="https://mitchleblanc.xyz"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#222",
                  color: "#ffe066",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  marginTop: 8,
                  display: "inline-block",
                  transition: "background 0.15s",
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
              padding: 16,
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
                  maxWidth: "80%",
                  fontSize: 14,
                  lineHeight: 1.4,
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
              padding: 12,
              borderTop: "1px solid #e5e7eb",
              background: "#fafafa",
            }}
          >
            <input
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 14,
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about the NBA CBA…"
            />
            <button
              type="submit"
              style={{
                marginLeft: 8,
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
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
              fontSize: "0.92rem",
              textAlign: "center",
              padding: "7px 0 9px 0",
              borderRadius: "0 0 12px 12px",
              borderTop: "1px solid #f3e0a8",
            }}
          >
            &copy; {new Date().getFullYear()} Mitch Leblanc. Powered by OpenAI.<br />
            <span style={{ color: "#aaa" }}>
              For informational purposes only. Always consult the official NBA CBA for legal certainty.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
