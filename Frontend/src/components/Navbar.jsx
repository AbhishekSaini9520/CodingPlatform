import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/themeContext";
import { socket } from "../socket/socket";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileImage = user?.profileImage;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {

    const handleNotification = (notif) => {

      console.log("New Notification:", notif);

      setNotifications((prev) => [notif, ...prev]);

      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);

  }, []);

  useEffect(() => {

    if (user?._id) {
      socket.emit("joinUser", user._id);
    }

  }, [user]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
    setOpen(false); // Close profile dropdown if open
  };

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/problems?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="bg-white text-gray-900 dark:bg-[#24292f] dark:text-gray-200 border-b border-gray-200 dark:border-none relative">
      <div className="px-6 py-2 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            &lt;/&gt; CodeHub
          </Link>
          {/* Links */}
          <div className="hidden md:flex gap-6 text-lg font-medium">
            <Link to="/problems" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Problems</Link>
            {/* <Link to="/contests" className="hover:text-white cursor-pointer transition-colors">Contests</Link> */}
            <Link to="/leaderboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Leaderboard</Link>
            <Link to="/discuss" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Discuss</Link>
          </div>
        </div>

        {/* CENTER SEARCH */}
        {/* <div className="hidden md:block w-1/3">
        <input
          type="text"
          placeholder="Search problems..."
          className="w-full bg-[#1f2428] border border-gray-600 rounded-md px-3 py-2 text-base focus:outline-none focus:border-blue-500 placeholder-gray-500 text-gray-200"
        />
      </div> */}
        <div className="hidden md:block w-1/3">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-gray-100 dark:bg-[#1f2428] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-base focus:outline-none focus:border-blue-500 placeholder-gray-500 text-gray-900 dark:text-gray-200"
          />
        </div>


        {/* RIGHT */}
        <div className="flex items-center gap-4">

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            )}
          </button>

          {!user ? (
            <div className="text-lg font-medium flex items-center gap-4">
              <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Register</Link>
              <span className="text-gray-400 dark:text-gray-500">or</span>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Log in</Link>
            </div>
          ) : (
            <>
              {/* Notification */}
              <div className="relative">
                <div onClick={handleBellClick} className="relative cursor-pointer">
                  <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#2d333b] rounded-md shadow-lg text-sm z-50 border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-200">
                      Notifications
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#373e47] transition-colors"
                        >
                          <p className="text-gray-800 dark:text-gray-200">
                            Someone <span className="font-semibold">{notif.type}d</span> your post!
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <div
                  onClick={() => {
                    setOpen(!open);
                    setShowNotifications(false); // Close notifications if open
                  }}
                  className="flex items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <img
                    src={profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    alt="profile"
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <ChevronDown size={16} />
                </div>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2d333b] rounded-md shadow-lg text-base z-50 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#373e47] cursor-pointer transition-colors rounded-t-md"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#373e47] cursor-pointer transition-colors"
                    >
                      Dashboard
                    </Link>
                    {user.role == 'admin' && <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#373e47] cursor-pointer transition-colors"
                    >
                      Admin Panel
                    </Link>}
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-[#373e47] rounded-b-md cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#24292f] space-y-4 absolute w-full left-0 top-full z-40 shadow-lg">
          <div className="flex flex-col gap-4 text-lg font-medium">
            <Link to="/problems" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Problems</Link>
            <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Leaderboard</Link>
            <Link to="/discuss" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Discuss</Link>
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                handleSearch(e);
                if (e.key === "Enter") setMobileMenuOpen(false);
              }}
              className="w-full bg-gray-100 dark:bg-[#1f2428] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-base focus:outline-none focus:border-blue-500 placeholder-gray-500 text-gray-900 dark:text-gray-200"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
