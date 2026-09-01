import { Bell, ChevronDown, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../features/auth/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PersonaQuickSwitcher from "../../features/persona/PersonaQuickSwitcher";

import "./AppLayout.css";

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

const navigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
    icon: "⌂",
  },
  {
    label: "Memory Vault",
    path: "/app/vault",
    icon: "▣",
  },
  {
    label: "Time Capsules",
    path: "/app/time-capsule",
    icon: "◷",
  },
  {
    label: "Family",
    path: "/app/family",
    icon: "♧",
  },
  {
    label: "AI Persona",
    path: "/app/persona",
    icon: "✦",
  },
  {
    label: "Sessions",
    path: "/app/sessions",
    icon: "◉",
  },
  {
    label: "Daily Prompt",
    path: "/app/daily-prompt",
    icon: "✎",
  },
  {
    label: "Reports",
    path: "/app/reports",
    icon: "▤",
  },
  {
    label: "Legacy",
    path: "/app/legacy",
    icon: "♡",
  },
  {
    label: "Activity",
    path: "/app/activity",
    icon: "↗",
  },
];

const accountNavigation: NavigationItem[] = [
  {
    label: "Profile",
    path: "/app/profile",
    icon: "◯",
  },
  {
    label: "Settings",
    path: "/app/settings",
    icon: "⚙",
  },
  {
    label: "Security",
    path: "/app/security",
    icon: "◈",
  },
  {
    label: "Billing",
    path: "/app/billing",
    icon: "▭",
  },
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setProfileOpen(false);
      setSidebarOpen(false);

      navigate("/login", {
        replace: true,
      });
    }
  };

  const isActive = (path: string) => {
    if (path === "/app/dashboard") {
      return location.pathname === path;
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);

    setSidebarOpen(false);
    setProfileOpen(false);
  };

  return (
    <div className="app-shell">
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          className="app-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* SIDEBAR */}

      <aside className={`app-sidebar ${sidebarOpen ? "app-sidebar-open" : ""}`}>
        <div className="app-sidebar-brand">
          <button
            type="button"
            className="app-brand"
            onClick={() => handleNavigate("/app/dashboard")}
          >
            <span className="app-brand-mark">E</span>

            <span className="app-brand-text">EchoLife</span>
          </button>

          <button
            type="button"
            className="app-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={17} />
          </button>
        </div>

        {/* MAIN NAVIGATION */}

        <nav className="app-navigation">
          <span className="app-nav-label">YOUR SPACE</span>

          {navigation.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`app-nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavigate(item.path)}
            >
              <span className="app-nav-icon">{item.icon}</span>

              <span>{item.label}</span>
            </button>
          ))}

          <span className="app-nav-label app-nav-account-label">ACCOUNT</span>

          {accountNavigation.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`app-nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavigate(item.path)}
            >
              <span className="app-nav-icon">{item.icon}</span>

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="app-sidebar-footer">
          <div className="app-storage">
            <div className="app-storage-top">
              <span>MEMORY SPACE</span>

              <strong>31%</strong>
            </div>

            <div className="app-storage-bar">
              <span
                style={{
                  width: "31%",
                }}
              />
            </div>

            <p>31 of 100 memories used</p>
          </div>

          <div className="app-sidebar-security">
            <ShieldCheck size={13} />

            <div>
              <strong>Private family space</strong>

              <span>Your memories stay protected.</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <div className="app-main">
        <header className="app-header">
          <div className="app-header-left">
            <button
              type="button"
              className="app-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>

            <div className="app-breadcrumb">
              <span>EchoLife</span>

              <span className="app-breadcrumb-separator">/</span>

              <strong>{getPageTitle(location.pathname)}</strong>
            </div>
          </div>

          <div className="app-header-right">
            <button
              type="button"
              className="app-notification-button"
              aria-label="Notifications"
            >
              <Bell size={16} />

              <span />
            </button>

            <div className="app-profile-wrapper">
              <button
                type="button"
                className="app-profile-button"
                onClick={() => setProfileOpen((current) => !current)}
              >
                <span className="app-profile-avatar">
                  {(user?.displayName?.trim() || "User")
                    .split(" ")
                    .map((name) => name.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>

                <span className="app-profile-info">
                  <strong>{user?.displayName?.trim() || "User"}</strong>

                  <small>{user?.role || "Member"}</small>
                </span>

                <ChevronDown
                  size={13}
                  className={profileOpen ? "rotate" : ""}
                />
              </button>

              {profileOpen && (
                <div className="app-profile-menu">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      handleNavigate("/app/profile");
                    }}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      handleNavigate("/app/settings");
                    }}
                  >
                    Settings
                  </button>

                  <div />

                  <button
                    type="button"
                    className="danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />

                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="app-content">
          <Outlet />
        </div>

        {/* PERSONA QUICK SWITCHER */}

        <PersonaQuickSwitcher />
      </div>
    </div>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname === "/app/dashboard") {
    return "Dashboard";
  }

  if (pathname.startsWith("/app/vault")) {
    return "Memory Vault";
  }

  if (pathname.startsWith("/app/time-capsule")) {
    return "Time Capsules";
  }

  if (pathname.startsWith("/app/family")) {
    return "Family";
  }

  if (pathname.startsWith("/app/persona/conversation")) {
    return "Persona Conversation";
  }

  if (pathname.startsWith("/app/persona/configure")) {
    return "Configure Persona";
  }

  if (pathname.startsWith("/app/persona")) {
    return "AI Persona";
  }

  if (pathname.startsWith("/app/sessions/")) {
    return "Session";
  }

  if (pathname === "/app/sessions") {
    return "Sessions";
  }

  if (pathname.startsWith("/app/daily-prompt")) {
    return "Daily Prompt";
  }

  if (pathname.startsWith("/app/ai-session")) {
    return "AI Session";
  }

  if (pathname.startsWith("/app/ai-reflection")) {
    return "AI Reflection";
  }

  if (pathname.startsWith("/app/reports")) {
    return "Reports";
  }

  if (pathname.startsWith("/app/legacy")) {
    return "Legacy";
  }

  if (pathname.startsWith("/app/activity")) {
    return "Activity";
  }

  if (pathname.startsWith("/app/profile")) {
    return "Profile";
  }

  if (pathname.startsWith("/app/settings")) {
    return "Settings";
  }

  if (pathname.startsWith("/app/security")) {
    return "Security";
  }

  if (pathname.startsWith("/app/billing")) {
    return "Billing";
  }

  return "EchoLife";
}

export default AppLayout;
