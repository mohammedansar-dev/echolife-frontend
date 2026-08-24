import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Lightbulb,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";

import "./DailyPromptPage.css";

const prompts = [
  {
    id: 1,
    category: "Family",
    title: "A memory worth keeping",
    text: "What is one family moment you wish you could experience one more time?",
  },
  {
    id: 2,
    category: "Childhood",
    title: "Growing up",
    text: "What is a small childhood moment that still makes you smile?",
  },
  {
    id: 3,
    category: "Relationships",
    title: "Someone special",
    text: "Who has had a meaningful impact on your life, and what do you remember most about them?",
  },
];

function DailyPromptPage() {
  const navigate = useNavigate();

  const [completed, setCompleted] = useState(false);

  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);

  const handleComplete = () => {
    setCompleted(true);
  };

  const handleNextPrompt = () => {
    const currentIndex = prompts.findIndex(
      (prompt) => prompt.id === selectedPrompt.id,
    );

    const nextIndex = (currentIndex + 1) % prompts.length;

    setSelectedPrompt(prompts[nextIndex]);

    setCompleted(false);
  };

  return (
    <main className="daily-prompt-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="daily-prompt-header">
        <div className="daily-prompt-heading">
          <div className="daily-prompt-heading-icon">
            <Lightbulb size={22} />
          </div>

          <div>
            <h1>Daily Prompt</h1>

            <p>
              Take a moment to reflect and preserve something meaningful from
              your day.
            </p>
          </div>
        </div>

        <Badge variant={completed ? "success" : "neutral"} dot>
          {completed ? "Completed" : "Today's prompt"}
        </Badge>
      </header>

      {/* =====================================================
          MAIN PROMPT
      ===================================================== */}

      <section className="daily-prompt-hero">
        <div className="daily-prompt-hero-top">
          <div className="daily-prompt-category">
            <Sparkles size={13} />
            {selectedPrompt.category}
          </div>

          <div className="daily-prompt-date">
            <CalendarDays size={13} />
            Aug 23, 2026
          </div>
        </div>

        <div className="daily-prompt-hero-content">
          <div className="daily-prompt-large-icon">
            <Heart size={27} />
          </div>

          <h2>{selectedPrompt.title}</h2>

          <p>{selectedPrompt.text}</p>
        </div>

        <div className="daily-prompt-actions">
          {!completed ? (
            <Button
              variant="primary"
              size="large"
              icon={<Check size={16} />}
              onClick={handleComplete}
            >
              Mark as reflected
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="large"
              icon={<MessageCircle size={16} />}
              onClick={() => navigate("/app/persona/conversation")}
            >
              Continue with Persona
            </Button>
          )}

          <Button
            variant="outline"
            size="large"
            icon={<ArrowRight size={15} />}
            onClick={handleNextPrompt}
          >
            Another prompt
          </Button>
        </div>
      </section>

      {/* =====================================================
          REFLECTION AREA
      ===================================================== */}

      <section className="daily-prompt-content-grid">
        <Card
          title="Your reflection"
          description="Write something you would like to remember."
        >
          <div className="daily-reflection">
            <textarea
              placeholder="Write your thoughts, memories, or feelings here..."
              disabled={completed}
            />

            <div className="daily-reflection-footer">
              <span>
                {completed
                  ? "Reflection completed"
                  : "Your reflection stays in your EchoLife space."}
              </span>

              {!completed && (
                <Button variant="primary" size="small" onClick={handleComplete}>
                  Save reflection
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <Card
          title="Your reflection journey"
          description="A simple view of your recent prompts."
        >
          <div className="daily-progress">
            <div className="daily-progress-stat">
              <div className="daily-progress-icon">
                <Check size={16} />
              </div>

              <div>
                <strong>7</strong>

                <span>Prompts completed</span>
              </div>
            </div>

            <div className="daily-progress-stat">
              <div className="daily-progress-icon">
                <Clock3 size={16} />
              </div>

              <div>
                <strong>12 min</strong>

                <span>Average reflection</span>
              </div>
            </div>

            <div className="daily-progress-bar">
              <div className="daily-progress-bar-header">
                <span>Weekly progress</span>

                <strong>7 / 7</strong>
              </div>

              <div className="daily-progress-track">
                <div className="daily-progress-fill" />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* =====================================================
          WHY IT MATTERS
      ===================================================== */}

      <Card
        title="Why daily reflection matters"
        description="Small reflections can become valuable memories over time."
      >
        <div className="daily-benefits">
          <div className="daily-benefit">
            <div className="daily-benefit-number">01</div>

            <div>
              <h3>Remember the small moments</h3>

              <p>
                Everyday moments can become some of the most meaningful
                memories.
              </p>
            </div>
          </div>

          <div className="daily-benefit">
            <div className="daily-benefit-number">02</div>

            <div>
              <h3>Build your memory collection</h3>

              <p>
                Your reflections can become part of your preserved family story.
              </p>
            </div>
          </div>

          <div className="daily-benefit">
            <div className="daily-benefit-number">03</div>

            <div>
              <h3>Create a habit of reflection</h3>

              <p>
                A few minutes each day can help you intentionally preserve what
                matters.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default DailyPromptPage;
