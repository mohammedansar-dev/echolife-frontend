import {
  Activity,
  Brain,
  ChevronDown,
  CreditCard,
  FileBarChart,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./Sidebar.css";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);

  const closeMobile = () => {
    onMobileClose?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("echolife_auth_user");
    localStorage.removeItem("echolife_token");

    navigate("/login", { replace: true });
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-nav-item ${isActive ? "active" : ""}`;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-mobile-overlay"
          onClick={closeMobile}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >
        {/* =====================================================
            BRAND
        ====================================================== */}

        <div className="sidebar-brand">
          <button
            type="button"
            className="sidebar-brand-button"
            onClick={() => {
              navigate("/app/dashboard");
              closeMobile();
            }}
            aria-label="Go to dashboard"
          >
            <div className="echolife-logo">
              <span className="echolife-logo-inner">
                E
              </span>
            </div>

            <div className="sidebar-brand-text">
              <strong>EchoLife</strong>
              <span>Preserve what matters</span>
            </div>
          </button>

          <button
            type="button"
            className="sidebar-close-mobile"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            MAIN NAVIGATION
        ====================================================== */}

        <nav className="sidebar-navigation">
          <NavLink
            to="/app/dashboard"
            className={navItemClass}
            onClick={closeMobile}
          >
            <Home size={19} />
            <span>Dashboard</span>
          </NavLink>

          {/* =================================================
              AI PERSONA — PARENT SECTION
          ================================================= */}

          <NavLink
            to="/app/persona"
            className={({ isActive }) =>
              `sidebar-nav-item sidebar-persona-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={closeMobile}
          >
            <Brain size={19} />
            <span>AI Persona</span>
          </NavLink>

          <NavLink
            to="/app/family"
            className={navItemClass}
            onClick={closeMobile}
          >
            <Users size={19} />
            <span>Family</span>
          </NavLink>

          <NavLink
            to="/app/sessions"
            className={navItemClass}
            onClick={closeMobile}
          >
            <MessageCircle size={19} />
            <span>Sessions</span>
          </NavLink>

          <NavLink
            to="/app/reports"
            className={navItemClass}
            onClick={closeMobile}
          >
            <FileBarChart size={19} />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/app/activity"
            className={navItemClass}
            onClick={closeMobile}
          >
            <Activity size={19} />
            <span>Activity</span>
          </NavLink>

          <NavLink
            to="/app/legacy"
            className={navItemClass}
            onClick={closeMobile}
          >
            <Heart size={19} />
            <span>Family & Legacy</span>
          </NavLink>
        </nav>

        {/* =====================================================
            ACCOUNT
        ====================================================== */}

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-account-toggle"
            onClick={() => setAccountOpen((value) => !value)}
          >
            <div className="sidebar-account-avatar">
              A
            </div>

            <div className="sidebar-account-info">
              <strong>Account</strong>
              <span>Manage your account</span>
            </div>

            <ChevronDown
              size={16}
              className={
                accountOpen
                  ? "sidebar-account-chevron open"
                  : "sidebar-account-chevron"
              }
            />
          </button>

          {accountOpen && (
            <div className="sidebar-account-menu">
              <NavLink
                to="/app/profile"
                className="sidebar-account-item"
                onClick={closeMobile}
              >
                <Settings size={16} />
                Profile & Settings
              </NavLink>

              <NavLink
                to="/app/security"
                className="sidebar-account-item"
                onClick={closeMobile}
              >
                <Shield size={16} />
                Security
              </NavLink>

              <NavLink
                to="/app/billing"
                className="sidebar-account-item"
                onClick={closeMobile}
              >
                <CreditCard size={16} />
                Billing
              </NavLink>

              <button
                type="button"
                className="sidebar-account-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile menu button */}
      {!mobileOpen && (
        <button
          type="button"
          className="sidebar-mobile-trigger"
          onClick={onMobileClose}
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>
      )}
    </>
  );
}

export default Sidebar;