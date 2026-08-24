import { ArrowLeft, Brain,  Send, Sparkles } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AISessionPage() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<
    {
      id: string;
      role: "user" | "assistant";
      text: string;
    }[]
  >([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello. I'm your EchoLife memory assistant. Ask me about your preserved memories, family stories, people, or important moments.",
    },
  ]);

  const sendMessage = () => {
    const value = message.trim();

    if (!value) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text: value,
      },
      {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: "I'm ready to help with your EchoLife memories. The AI memory service will provide the real response once it is connected.",
      },
    ]);

    setMessage("");
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      {/* HEADER */}

      <section className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Sparkles size={19} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">EchoLife AI</h1>

            <p className="text-xs text-slate-500">Memory assistant</p>
          </div>
        </div>
      </section>

      {/* CHAT */}

      <section className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* CHAT HEADER */}

        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Brain size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Memory Assistant
              </p>

              <p className="text-xs text-emerald-600">Ready</p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}

        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`flex ${
                item.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  item.role === "user"
                    ? "rounded-br-md bg-blue-600 text-white"
                    : "rounded-bl-md bg-slate-100 text-slate-700"
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:bg-white">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              placeholder="Ask about your memories..."
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={!message.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </div>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            EchoLife AI uses memories that your family has chosen to preserve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AISessionPage;
