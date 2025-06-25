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
        <title>NBA CBA Chat</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{
          margin: 0,
          padding: 0,
          height: "100vh",
          fontFamily: "'Instrument Sans', sans-serif",
          background: "#f4f4f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            width: "100%",
            maxWidth: 480,
            height: "90vh",
            borderRadius: 12,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
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
                <ReactMarkdown>{msg.content}</ReactMarkdown> {/* ✅ Markdown rendering */}
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
        </div>
      </div>
    </>
  );
}
