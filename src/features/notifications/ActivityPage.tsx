import {
  CalendarDays,
  FileHeart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "./ActivityPage.css";

const activities = [
  {
    icon: <FileHeart size={17} />,
    title: "Memory added",
    description: "A new memory was added to your private vault.",
    date: "Today",
    type: "Memory",
  },
  {
    icon: <Sparkles size={17} />,
    title: "Daily reflection completed",
    description: "You completed today's personal reflection.",
    date: "Today",
    type: "Reflection",
  },
  {
    icon: <LockKeyhole size={17} />,
    title: "Time capsule created",
    description: "A memory was prepared for a future date.",
    date: "Yesterday",
    type: "Time Capsule",
  },
  {
    icon: <ShieldCheck size={17} />,
    title: "Security check completed",
    description: "Your account security status was checked.",
    date: "Yesterday",
    type: "Security",
  },
];

function ActivityPage() {
  return (
    <section className="activity-page">
      <div className="activity-header">
        <div>
          <div className="activity-eyebrow">
            <CalendarDays size={15} />
            Your EchoLife journey
          </div>

          <h1>Activity</h1>

          <p>
            A timeline of important activity across your private memory space.
          </p>
        </div>
      </div>

      <div className="activity-card">
        <div className="activity-card-header">
          <div>
            <h2>Recent activity</h2>

            <p>Your latest EchoLife events.</p>
          </div>
        </div>

        <div className="activity-timeline">
          {activities.map((activity, index) => (
            <div key={`${activity.title}-${index}`} className="activity-item">
              <div className="activity-line">
                <div className="activity-icon">{activity.icon}</div>

                {index !== activities.length - 1 && <span />}
              </div>

              <div className="activity-content">
                <div className="activity-content-top">
                  <h3>{activity.title}</h3>

                  <span>{activity.date}</span>
                </div>

                <p>{activity.description}</p>

                <small>{activity.type}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ActivityPage;
