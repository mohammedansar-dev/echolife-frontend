import {
  BarChart3,
  Brain,
  CalendarClock,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Image,
  LockKeyhole,
  Mic,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
    icon: Home,
  },
  {
    label: "Memory Vault",
    path: "/app/vault",
    icon: Image,
  },
  {
    label: "Time Capsules",
    path: "/app/time-capsule",
    icon: LockKeyhole,
  },
  {
    label: "Family",
    path: "/app/family",
    icon: Users,
  },
  {
    label: "AI Persona",
    path: "/app/persona",
    icon: Sparkles,
  },
  {
    label: "Sessions",
    path: "/app/sessions",
    icon: Mic,
  },

  {
    label: "Reports",
    path: "/app/reports",
    icon: BarChart3,
  },
  {
    label: "Activity",
    path: "/app/activity",
    icon: Sparkles,
  },
  {
    label: "Family & Legacy",
    path: "/app/legacy",
    icon: Brain,
  },
];

const accountNavigation = [
  {
    label: "Profile",
    path: "/app/profile",
    icon: Users,
  },
  {
    label: "Settings",
    path: "/app/settings",
    icon: Settings,
  },
  {
    label: "Security",
    path: "/app/security",
    icon: ShieldCheck,
  },
  {
    label: "Billing",
    path: "/app/billing",
    icon: CreditCard,
  },
];

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const displayName = user?.displayName?.trim() || "User";

  const role =
    user?.role && user.role.trim().length > 0
      ? formatRole(user.role)
      : "Member";

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[238px]
          flex-col
          border-r
          border-slate-200/80
          bg-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ======================================================
            BRAND
        ====================================================== */}

        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <NavLink
            to="/app/dashboard"
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            <span
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-indigo-600
                text-sm
                font-extrabold
                text-white
                shadow-[0_5px_14px_rgba(37,99,235,0.18)]
              "
            >
              E
            </span>

            <span className="text-[18px] font-extrabold tracking-[-0.03em] text-slate-900">
              Echo<span className="text-blue-600">Life</span>
            </span>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="
              hidden
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              max-lg:flex
            "
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        {/* ======================================================
            NAVIGATION
        ====================================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
            Your Space
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group
                    relative
                    flex
                    min-h-[40px]
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    text-[13px]
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-[#f0edff] font-semibold text-[#5745c9]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-6
                            w-1
                            -translate-y-1/2
                            rounded-r-full
                            bg-[#5a46d1]
                          "
                        />
                      )}

                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all
                          ${
                            isActive
                              ? "bg-white text-[#5b49ca] shadow-sm"
                              : "text-slate-400 group-hover:text-slate-700"
                          }
                        `}
                      >
                        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                      </span>

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>

                      <ChevronRight
                        size={14}
                        className={`
                          shrink-0
                          transition-all
                          ${
                            isActive
                              ? "translate-x-0 text-[#7967d9] opacity-100"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-40"
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          <p className="mb-3 mt-7 px-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
            Account
          </p>

          <div className="space-y-1">
            {accountNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    min-h-[40px]
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    text-[13px]
                    font-medium
                    transition-all
                    ${
                      isActive
                        ? "bg-[#f0edff] font-semibold text-[#5745c9]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          ${
                            isActive
                              ? "text-[#5b49ca]"
                              : "text-slate-400 group-hover:text-slate-700"
                          }
                        `}
                      >
                        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                      </span>

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ======================================================
            ACCOUNT FOOTER
        ====================================================== */}

        <div className="shrink-0 border-t border-slate-100 p-3">
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-100
              bg-slate-50/80
              p-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-50
                text-xs
                font-extrabold
                text-indigo-700
                ring-1
                ring-indigo-100
              "
            >
              {initials || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-800">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                {role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function formatRole(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default Sidebar;
