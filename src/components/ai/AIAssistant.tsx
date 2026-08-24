import { ArrowRight, Brain, MessageCircle, Sparkles, X } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface RecentConversation {
  id: string;
  title: string;
  preview: string;
  time: string;
}

const recentConversations: RecentConversation[] = [
  {
    id: "1",
    title: "Family memories",
    preview: "Tell me about our family memories.",
    time: "Recently",
  },
  {
    id: "2",
    title: "Goa trip",
    preview: "Show me memories from our Goa trip.",
    time: "Yesterday",
  },
  {
    id: "3",
    title: "Grandfather's stories",
    preview: "Tell me about grandfather's stories.",
    time: "2 days ago",
  },
];

function AIAssistant() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  /*
   * Do not show the floating assistant
   * on the AI session page itself.
   */
  const isAISessionPage =
    location.pathname === "/app/ai-session" ||
    location.pathname.startsWith("/app/ai-session/");

  if (isAISessionPage) {
    return null;
  }

  const openAISession = () => {
    setOpen(false);
    navigate("/app/ai-session");
  };

  return (
    <>
      {/* ===================================== */}
      {/* AI PANEL */}
      {/* ===================================== */}

      {open && (
        <div className="fixed bottom-24 right-4 z-[80] w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:right-6">
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sparkles size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  EchoLife AI
                </h2>

                <p className="text-xs text-slate-500">Your memory assistant</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close AI assistant"
            >
              <X size={17} />
            </button>
          </div>

          {/* INTRO */}

          <div className="px-5 py-4">
            <div className="rounded-2xl bg-blue-50/70 p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Brain size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    What would you like to remember?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Ask about your memories, family stories, people, places, or
                    important moments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT */}

          <div className="px-5 pb-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Recent conversations
              </p>
            </div>

            <div className="space-y-1">
              {recentConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={openAISession}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <MessageCircle size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {conversation.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {conversation.preview}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] text-slate-400">
                    {conversation.time}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* OPEN SESSION */}

          <div className="border-t border-slate-100 p-3">
            <button
              type="button"
              onClick={openAISession}
              className="flex w-full items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} />
                Start AI session
              </span>

              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================== */}
      {/* FLOATING BUTTON */}
      {/* ===================================== */}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`fixed bottom-6 right-4 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:right-6 ${
          open ? "rotate-0" : ""
        }`}
        aria-label={open ? "Close EchoLife AI" : "Open EchoLife AI"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}

        {!open && (
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </button>
    </>
  );
}

export default AIAssistant;
