import {
  BarChart3,
  ChevronRight,
  CreditCard,
  Home,
  Image,
  Mic,
  Settings,
  Sparkles,
  Users,
  X,
  Brain,
  LockKeyhole,
} from "lucide-react";
import { NavLink } from "react-router-dom";

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
    label: "Memories",
    path: "/app/vault",
    icon: Image,
  },
  {
    label: "Time Capsule",
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
    label: "Billing",
    path: "/app/billing",
    icon: CreditCard,
  },
  {
    label: "Daily Reflection",
    path: "/app/daily-prompt",
    icon: Sparkles,
  },
  {
    label: "AI Reflection",
    path: "/app/ai-reflection",
    icon: Brain,
  },
  {
    label: "Family & Legacy",
    path: "/app/legacy",
    icon: Users,
  },
];

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[260px]
          flex-col
          border-r
          border-slate-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          lg:static
          lg:z-auto
          lg:translate-x-0
          lg:shadow-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
              E
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900">
                Echo<span className="text-blue-600">Life</span>
              </div>

              <p className="text-[10px] font-medium text-slate-400">
                Digital memory space
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Workspace
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
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                      )}

                      <span
                        className={`
                          flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition
                          ${
                            isActive
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-slate-500 group-hover:text-slate-800"
                          }
                        `}
                      >
                        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                      </span>

                      <span className="flex-1">{item.label}</span>

                      <ChevronRight
                        size={15}
                        className={`
                          transition
                          ${
                            isActive
                              ? "translate-x-0 opacity-100 text-blue-500"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="shrink-0 border-t border-slate-100 p-3">
          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-sm
              font-medium
              transition
              ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
              `
            }
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg">
              <Settings size={18} />
            </span>
            Settings
          </NavLink>

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                Ansar
              </p>

              <p className="truncate text-xs text-slate-500">Family Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
