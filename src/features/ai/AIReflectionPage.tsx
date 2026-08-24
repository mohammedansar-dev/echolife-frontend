import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lightbulb,
  LockKeyhole,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import "./AIReflectionPage.css";

type ReflectionTopic = "Memories" | "Family" | "Gratitude" | "Personal Growth";

const topics: ReflectionTopic[] = [
  "Memories",
  "Family",
  "Gratitude",
  "Personal Growth",
];

const prompts: Record<ReflectionTopic, string> = {
  Memories:
    "What memory has been on your mind recently, and why does it still matter to you?",
  Family:
    "What is something about your family that you hope will always be remembered?",
  Gratitude:
    "What person, experience, or small moment are you especially grateful for?",
  "Personal Growth": "What have you learned about yourself recently?",
};

function AIReflectionPage() {
  const [topic, setTopic] = useState<ReflectionTopic>("Memories");

  const [text, setText] = useState("");

  const [generated, setGenerated] = useState(false);

  const [saved, setSaved] = useState(false);

  const maxCharacters = 1200;

  const generateReflection = () => {
    if (!text.trim()) return;

    setGenerated(true);
    setSaved(false);
  };

  const startAgain = () => {
    setText("");
    setGenerated(false);
    setSaved(false);
  };

  const saveReflection = () => {
    setSaved(true);
  };

  return (
    <main className="ai-reflection-page">
      {/* HEADER */}

      <header className="ai-reflection-header">
        <div>
          <span className="ai-reflection-eyebrow">
            <Sparkles size={11} />
            AI REFLECTION
          </span>

          <h1>Reflect a little deeper.</h1>

          <p>Share a thought and let EchoLife help you explore its meaning.</p>
        </div>

        <div className="ai-reflection-private">
          <LockKeyhole size={13} />

          <div>
            <span>PRIVATE</span>
            <strong>Your reflection space</strong>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <section className="ai-reflection-layout">
        <div className="ai-reflection-main">
          {/* TOPIC */}

          <section className="ai-reflection-card">
            <div className="ai-reflection-card-heading">
              <div>
                <span>STEP 01</span>
                <h2>Choose a topic</h2>
              </div>
            </div>

            <div className="ai-reflection-topics">
              {topics.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={topic === item ? "active" : ""}
                  onClick={() => {
                    setTopic(item);
                    setGenerated(false);
                    setSaved(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* WRITING */}

          <section className="ai-reflection-card">
            <div className="ai-reflection-card-heading">
              <div>
                <span>STEP 02</span>
                <h2>Share your thoughts</h2>
              </div>

              <button
                type="button"
                className="ai-reflection-new"
                onClick={startAgain}
              >
                <RefreshCw size={12} />
                Clear
              </button>
            </div>

            <div className="ai-reflection-question">
              <div className="ai-reflection-question-icon">
                <Lightbulb size={17} />
              </div>

              <p>{prompts[topic]}</p>
            </div>

            <div className="ai-reflection-textarea">
              <textarea
                value={text}
                maxLength={maxCharacters}
                onChange={(event) => {
                  setText(event.target.value);
                  setGenerated(false);
                  setSaved(false);
                }}
                placeholder="Write naturally. There is no right or wrong answer..."
              />

              <span>
                {text.length}/{maxCharacters}
              </span>
            </div>

            <div className="ai-reflection-write-footer">
              <div>
                <LockKeyhole size={10} />
                Only you can see this reflection
              </div>

              <button
                type="button"
                className="ai-reflection-generate"
                disabled={!text.trim()}
                onClick={generateReflection}
              >
                Reflect with AI
                <ArrowRight size={13} />
              </button>
            </div>
          </section>

          {/* AI RESULT */}

          {generated && (
            <section className="ai-reflection-result">
              <div className="ai-reflection-result-header">
                <div className="ai-reflection-result-icon">
                  <Sparkles size={16} />
                </div>

                <div>
                  <span>AI REFLECTION</span>
                  <h2>A thought to consider</h2>
                </div>
              </div>

              <div className="ai-reflection-result-body">
                <p>
                  Your reflection suggests that this memory carries personal
                  meaning beyond the moment itself. The fact that you chose to
                  preserve it may indicate that it represents something you
                  value, whether that is connection, belonging, gratitude, or a
                  feeling you want to carry forward.
                </p>

                <p>
                  Consider what you would want your future self or family to
                  understand about this moment.
                </p>
              </div>

              <div className="ai-reflection-result-footer">
                {!saved ? (
                  <>
                    <span>This is a reflection prompt, not a judgment.</span>

                    <button type="button" onClick={saveReflection}>
                      Save reflection
                      <CheckCircle2 size={13} />
                    </button>
                  </>
                ) : (
                  <div className="ai-reflection-saved">
                    <CheckCircle2 size={14} />
                    Reflection saved to your EchoLife space.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}

        <aside className="ai-reflection-sidebar">
          <div className="ai-reflection-side-card">
            <div className="ai-reflection-side-heading">
              <Clock3 size={14} />

              <div>
                <span>REFLECTION</span>
                <strong>Your session</strong>
              </div>
            </div>

            <div className="ai-reflection-side-stat">
              <span>Topic</span>
              <strong>{topic}</strong>
            </div>

            <div className="ai-reflection-side-stat">
              <span>Status</span>

              <strong>{generated ? "Reflection ready" : "In progress"}</strong>
            </div>
          </div>

          <div className="ai-reflection-side-card ai-reflection-tip">
            <div className="ai-reflection-tip-icon">
              <Sparkles size={14} />
            </div>

            <div>
              <strong>Go deeper</strong>

              <p>
                Don't try to make your answer perfect. Honest thoughts usually
                create the most meaningful reflections.
              </p>
            </div>
          </div>

          <div className="ai-reflection-side-card ai-reflection-privacy">
            <LockKeyhole size={14} />

            <div>
              <strong>Private by design</strong>

              <p>Your reflection stays within your EchoLife family space.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default AIReflectionPage;
