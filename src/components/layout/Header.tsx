import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationCenter from "../../features/notifications/NotificationCenter";
import { useAuth } from "../../features/auth/AuthContext";
import GlobalSearch from "../../features/search/GlobalSearch";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [userOpen, setUserOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /*
   * =====================================================
   * USER INFORMATION
   * =====================================================
   */

  const displayName = user?.displayName?.trim() || "User";

  const role =
    user?.role && user.role.trim().length > 0
      ? formatRole(user.role)
      : "Member";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  function formatRole(value: string) {
    return value
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /*
   * =====================================================
   * LOGOUT
   * =====================================================
   */

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUserOpen(false);
      setNotificationOpen(false);
      setSearchOpen(false);

      navigate("/login", {
        replace: true,
      });
    }
  };

  /*
   * =====================================================
   * SEARCH
   * =====================================================
   */

  const openSearch = () => {
    setSearchOpen(true);
    setUserOpen(false);
    setNotificationOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  /*
   * =====================================================
   * KEYBOARD SEARCH
   * =====================================================
   */

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        openSearch();
      }

      if (event.key === "Escape" && searchOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [searchOpen]);

  /*
   * =====================================================
   * NAVIGATION
   * =====================================================
   */

  const goToProfile = () => {
    setUserOpen(false);
    navigate("/app/profile");
  };

  const goToSettings = () => {
    setUserOpen(false);
    navigate("/app/settings");
  };

  const goToSecurity = () => {
    setUserOpen(false);
    navigate("/app/security");
  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <>
      {/* =================================================
          GLOBAL SEARCH
      ================================================= */}

      {searchOpen && (
        <>
          <div
            className="
              fixed
              inset-0
              z-[70]
              bg-slate-950/10
              backdrop-blur-[2px]
            "
            onClick={closeSearch}
            aria-hidden="true"
          />

          <GlobalSearch onClose={closeSearch} />
        </>
      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          sticky
          top-0
          z-30
          flex
          h-[72px]
          shrink-0
          items-center
          justify-between
          border-b
          border-slate-200/80
          bg-white/95
          px-4
          backdrop-blur-md
          sm:px-6
          lg:px-7
        "
      >
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}

          <button
            type="button"
            onClick={onMenuClick}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-600
              transition
              hover:bg-slate-100
              hover:text-slate-900
              lg:hidden
            "
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          {/* Desktop search */}

          <button
            type="button"
            onClick={openSearch}
            aria-label="Search memories"
            className="
              hidden
              h-10
              w-[260px]
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-3.5
              text-left
              transition
              hover:border-slate-300
              hover:bg-white
              focus:border-indigo-300
              focus:bg-white
              focus:outline-none
              focus:ring-4
              focus:ring-indigo-50
              sm:flex
              lg:w-[330px]
            "
          >
            <Search
              size={17}
              strokeWidth={2}
              className="shrink-0 text-slate-400"
            />

            <span className="flex-1 truncate text-sm text-slate-400">
              Search memories...
            </span>

            <kbd
              className="
                hidden
                rounded-md
                border
                border-slate-200
                bg-white
                px-1.5
                py-0.5
                text-[10px]
                font-medium
                text-slate-400
                lg:block
              "
            >
              /
            </kbd>
          </button>

          {/* Mobile search */}

          <button
            type="button"
            onClick={openSearch}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
              sm:hidden
            "
            aria-label="Search memories"
          >
            <Search size={19} />
          </button>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex items-center gap-1.5">
          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((value) => !value);

                setUserOpen(false);
                setSearchOpen(false);
              }}
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-800
              "
              aria-label="Notifications"
              aria-expanded={notificationOpen}
            >
              <Bell size={19} strokeWidth={1.9} />

              {/* Notification indicator */}

              <span
                className="
                  absolute
                  right-[9px]
                  top-[8px]
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-indigo-600
                  ring-2
                  ring-white
                "
              />
            </button>

            {/* =================================================
                NOTIFICATION CENTER
            ================================================= */}

            {notificationOpen && (
              <div
                className="
      absolute
      right-0
      top-[52px]
      z-50
      w-[380px]
      max-w-[calc(100vw-24px)]
    "
              >
                <NotificationCenter
                  onClose={() => setNotificationOpen(false)}
                />
              </div>
            )}
          </div>

          {/* =================================================
              USER
          ================================================= */}

          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => {
                setUserOpen((value) => !value);

                setNotificationOpen(false);
                setSearchOpen(false);
              }}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                p-1.5
                transition
                hover:bg-slate-50
              "
              aria-expanded={userOpen}
              aria-label="Open user menu"
            >
              {/* Avatar */}

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
                  text-sm
                  font-bold
                  text-indigo-700
                  ring-1
                  ring-indigo-100
                "
              >
                {avatarLetter}
              </div>

              {/* Name */}

              <div className="hidden min-w-0 text-left md:block">
                <p
                  className="
                    max-w-[150px]
                    truncate
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  {displayName}
                </p>

                <p
                  className="
                    mt-0.5
                    max-w-[150px]
                    truncate
                    text-xs
                    text-slate-500
                  "
                >
                  {role}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`
                  hidden
                  text-slate-400
                  transition
                  md:block
                  ${userOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* =================================================
                USER DROPDOWN
            ================================================= */}

            {userOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[52px]
                  z-50
                  w-[270px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-2
                  shadow-[0_18px_55px_rgba(15,23,42,0.14)]
                "
              >
                {/* User information */}

                <div
                  className="
                    border-b
                    border-slate-100
                    px-3
                    py-3.5
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-50
                        text-base
                        font-bold
                        text-indigo-700
                        ring-1
                        ring-indigo-100
                      "
                    >
                      {avatarLetter}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {displayName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {user?.email || "No email available"}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-indigo-600">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu */}

                <div className="py-2">
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      text-slate-600
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <User size={17} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={goToSettings}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      text-slate-600
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <Settings size={17} />
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={goToSecurity}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      text-slate-600
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <ShieldCheck size={17} />
                    Security
                  </button>
                </div>

                {/* Logout */}

                <div
                  className="
                    border-t
                    border-slate-100
                    pt-2
                  "
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      font-semibold
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
