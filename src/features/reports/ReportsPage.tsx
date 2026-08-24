import {
  BarChart3,
  CalendarDays,
  FileHeart,
  Image as ImageIcon,
  Mic,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react";

import { useMemo, useState } from "react";

import "./ReportsPage.css";

type ReportPeriod = "7" | "30" | "90";

interface CategoryItem {
  name: string;
  count: number;
  percentage: number;
}

interface ActivityItem {
  day: string;
  memories: number;
  sessions: number;
}

const categoryData: CategoryItem[] = [
  {
    name: "Family",
    count: 12,
    percentage: 38,
  },
  {
    name: "Travel",
    count: 8,
    percentage: 25,
  },
  {
    name: "Milestones",
    count: 6,
    percentage: 19,
  },
  {
    name: "Personal",
    count: 5,
    percentage: 18,
  },
];

const activityData: Record<ReportPeriod, ActivityItem[]> = {
  "7": [
    { day: "Mon", memories: 2, sessions: 1 },
    { day: "Tue", memories: 4, sessions: 2 },
    { day: "Wed", memories: 1, sessions: 1 },
    { day: "Thu", memories: 3, sessions: 2 },
    { day: "Fri", memories: 5, sessions: 2 },
    { day: "Sat", memories: 2, sessions: 3 },
    { day: "Sun", memories: 4, sessions: 1 },
  ],

  "30": [
    { day: "W1", memories: 8, sessions: 4 },
    { day: "W2", memories: 13, sessions: 7 },
    { day: "W3", memories: 9, sessions: 5 },
    { day: "W4", memories: 16, sessions: 8 },
  ],

  "90": [
    { day: "Jan", memories: 14, sessions: 7 },
    { day: "Feb", memories: 19, sessions: 9 },
    { day: "Mar", memories: 24, sessions: 12 },
  ],
};

function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("30");

  const currentActivity = useMemo(() => activityData[period], [period]);

  const totalMemories = 31;

  const totalSessions = 18;

  const totalReflections = 14;

  const photoCount = 21;

  const videoCount = 6;

  const audioCount = 4;

  const totalActivity = currentActivity.reduce(
    (total, item) => total + item.memories + item.sessions,
    0,
  );

  const maxActivity = Math.max(
    ...currentActivity.map((item) => item.memories + item.sessions),
  );

  return (
    <main className="reports-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="reports-header">
        <div>
          <span className="reports-eyebrow">ECHOLIFE INSIGHTS</span>

          <h1>Reports</h1>

          <p>
            A simple overview of how your family memory space is growing and
            being used.
          </p>
        </div>

        <div className="reports-period">
          <CalendarDays size={14} />

          <button
            type="button"
            className={period === "7" ? "active" : ""}
            onClick={() => setPeriod("7")}
          >
            7D
          </button>

          <button
            type="button"
            className={period === "30" ? "active" : ""}
            onClick={() => setPeriod("30")}
          >
            30D
          </button>

          <button
            type="button"
            className={period === "90" ? "active" : ""}
            onClick={() => setPeriod("90")}
          >
            90D
          </button>
        </div>
      </header>

      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      <section className="reports-overview">
        <article className="report-stat-card">
          <div className="report-stat-icon blue">
            <FileHeart size={18} />
          </div>

          <div>
            <span>Total memories</span>

            <strong>{totalMemories}</strong>

            <small>
              <TrendingUp size={11} />
              Growing collection
            </small>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon violet">
            <Sparkles size={18} />
          </div>

          <div>
            <span>Reflections</span>

            <strong>{totalReflections}</strong>

            <small>Completed</small>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon green">
            <Mic size={18} />
          </div>

          <div>
            <span>Sessions</span>

            <strong>{totalSessions}</strong>

            <small>Conversations</small>
          </div>
        </article>

        <article className="report-stat-card">
          <div className="report-stat-icon orange">
            <BarChart3 size={18} />
          </div>

          <div>
            <span>Recent activity</span>

            <strong>{totalActivity}</strong>

            <small>Selected period</small>
          </div>
        </article>
      </section>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <section className="reports-main-grid">
        {/* ACTIVITY */}

        <article className="report-panel report-activity-panel">
          <div className="report-panel-header">
            <div>
              <span>ACTIVITY</span>

              <h2>Memory activity</h2>

              <p>Memories and conversations over time.</p>
            </div>

            <BarChart3 size={17} />
          </div>

          <div className="activity-chart">
            <div className="activity-chart-values">
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>

            <div className="activity-chart-area">
              <div className="activity-grid-line line-1" />
              <div className="activity-grid-line line-2" />
              <div className="activity-grid-line line-3" />
              <div className="activity-grid-line line-4" />
              <div className="activity-grid-line line-5" />

              <div className="activity-bars">
                {currentActivity.map((item) => {
                  const total = item.memories + item.sessions;

                  const height =
                    maxActivity > 0 ? (total / maxActivity) * 100 : 0;

                  return (
                    <div key={item.day} className="activity-bar-column">
                      <div className="activity-bar-wrapper">
                        <div
                          className="activity-bar"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${total} activities`}
                        />
                      </div>

                      <span>{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="activity-chart-legend">
            <span>
              <i className="memory-dot" />
              Memories
            </span>

            <span>
              <i className="session-dot" />
              Sessions
            </span>
          </div>
        </article>

        {/* CATEGORIES */}

        <article className="report-panel">
          <div className="report-panel-header">
            <div>
              <span>MEMORY COLLECTION</span>

              <h2>Categories</h2>

              <p>How your memories are organized.</p>
            </div>

            <FileHeart size={17} />
          </div>

          <div className="category-list">
            {categoryData.map((category) => (
              <div key={category.name} className="category-row">
                <div className="category-row-top">
                  <strong>{category.name}</strong>

                  <span>{category.count}</span>
                </div>

                <div className="category-progress">
                  <div
                    style={{
                      width: `${category.percentage}%`,
                    }}
                  />
                </div>

                <small>{category.percentage}% of memories</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* =====================================================
          MEDIA BREAKDOWN
      ===================================================== */}

      <section className="report-panel report-media-panel">
        <div className="report-panel-header">
          <div>
            <span>MEDIA</span>

            <h2>Memory formats</h2>

            <p>Your preserved memories by media type.</p>
          </div>

          <ImageIcon size={17} />
        </div>

        <div className="media-breakdown">
          <div className="media-item">
            <div className="media-icon photo">
              <ImageIcon size={17} />
            </div>

            <div>
              <span>Photos</span>
              <strong>{photoCount}</strong>
            </div>

            <div className="media-line">
              <div
                style={{
                  width: `${(photoCount / totalMemories) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="media-item">
            <div className="media-icon video">
              <Video size={17} />
            </div>

            <div>
              <span>Videos</span>
              <strong>{videoCount}</strong>
            </div>

            <div className="media-line">
              <div
                style={{
                  width: `${(videoCount / totalMemories) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="media-item">
            <div className="media-icon audio">
              <Mic size={17} />
            </div>

            <div>
              <span>Audio</span>
              <strong>{audioCount}</strong>
            </div>

            <div className="media-line">
              <div
                style={{
                  width: `${(audioCount / totalMemories) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INSIGHTS
      ===================================================== */}

      <section className="reports-insights">
        <div className="reports-insights-icon">
          <Sparkles size={17} />
        </div>

        <div>
          <span>ECHOLIFE INSIGHT</span>

          <h2>Your memory space is growing</h2>

          <p>
            You have preserved {totalMemories} memories across{" "}
            {categoryData.length} categories. Keep adding the moments that
            matter most to your family.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ReportsPage;
