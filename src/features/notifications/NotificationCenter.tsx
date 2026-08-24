import {
  Bell,
  Check,
  CheckCheck,
  Clock3,
  FileHeart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { useState } from "react";

import type { NotificationItem } from "./notification.types";

import "./NotificationCenter.css";

interface NotificationCenterProps {
  onClose: () => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notification-1",
    type: "memory",
    title: "Memory saved",
    description: "Your new memory has been added to your EchoLife space.",
    time: "Just now",
    read: false,
  },
  {
    id: "notification-2",
    type: "reflection",
    title: "Daily reflection",
    description: "You completed today's reflection.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: "notification-3",
    type: "security",
    title: "Account protected",
    description: "Your EchoLife security checks are up to date.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "notification-4",
    type: "capsule",
    title: "Time capsule reminder",
    description: "You have memories waiting for a future date.",
    time: "Yesterday",
    read: true,
  },
];

function getNotificationIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "memory":
      return <FileHeart size={17} />;

    case "reflection":
      return <Sparkles size={17} />;

    case "security":
      return <ShieldCheck size={17} />;

    case "capsule":
      return <LockKeyhole size={17} />;

    default:
      return <Bell size={17} />;
  }
}

function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  /*
   * =====================================================
   * MARK ONE AS READ
   * =====================================================
   */

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  };

  /*
   * =====================================================
   * MARK ALL AS READ
   * =====================================================
   */

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  /*
   * =====================================================
   * REMOVE NOTIFICATION
   * =====================================================
   */

  const removeNotification = (id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="notification-center">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="notification-center-header">
        <div>
          <div className="notification-center-title">
            <h2>Notifications</h2>

            {unreadCount > 0 && <span>{unreadCount}</span>}
          </div>

          <p>Stay updated with your EchoLife space.</p>
        </div>

        {/* CLOSE BUTTON */}

        <button
          type="button"
          className="notification-close"
          onClick={onClose}
          aria-label="Close notifications"
          title="Close notifications"
        >
          <X size={17} />
        </button>
      </div>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      {notifications.length > 0 ? (
        <>
          {/* TOOLBAR */}

          <div className="notification-toolbar">
            <span>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </span>

            {unreadCount > 0 && (
              <button type="button" onClick={markAllAsRead}>
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* LIST */}

          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read ? "" : "unread"
                }`}
              >
                {/* ICON */}

                <div className="notification-item-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* CONTENT */}

                <div className="notification-item-content">
                  <div className="notification-item-title">
                    <h3>{notification.title}</h3>

                    {!notification.read && (
                      <span className="notification-unread-dot" />
                    )}
                  </div>

                  <p>{notification.description}</p>

                  <div className="notification-item-time">
                    <Clock3 size={12} />

                    {notification.time}
                  </div>

                  {/* ACTIONS */}

                  <div className="notification-item-actions">
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check size={13} />
                        Mark read
                      </button>
                    )}

                    <button
                      type="button"
                      className="delete"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="notification-empty">
          <div className="notification-empty-icon">
            <Bell size={25} />
          </div>

          <h3>No notifications</h3>

          <p>You're all caught up. New EchoLife activity will appear here.</p>
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="notification-footer">
        <button
          type="button"
          onClick={() => {
            onClose();

            window.location.href = "/app/activity";
          }}
        >
          View all activity
        </button>
      </div>
    </div>
  );
}

export default NotificationCenter;
