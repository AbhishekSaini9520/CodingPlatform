import { useState } from "react";
import { Bell, Plus, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#24292f] text-gray-200 px-4 py-2 flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="text-xl font-bold text-white cursor-pointer">
          &lt;/&gt; CodeHub
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <span className="hover:text-white cursor-pointer">Problems</span>
          <span className="hover:text-white cursor-pointer">Contests</span>
          <span className="hover:text-white cursor-pointer">Leaderboard</span>
          <span className="hover:text-white cursor-pointer">Discuss</span>
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="hidden md:block w-1/3">
        <input
          type="text"
          placeholder="Search problems..."
          className="w-full bg-[#1f2428] border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <Bell className="w-5 h-5 hover:text-white cursor-pointer" />

        {/* Profile */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 cursor-pointer hover:text-white"
          >
            <img
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt="profile"
              className="w-6 h-6 rounded-full"
            />
            <ChevronDown size={16} />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-[#2d333b] rounded-md shadow-lg text-sm">
              <div className="px-4 py-2 hover:bg-[#373e47] cursor-pointer">
                Profile
              </div>
              <div className="px-4 py-2 hover:bg-[#373e47] cursor-pointer">
                Dashboard
              </div>
              <div className="border-t border-gray-600"></div>
              <div className="px-4 py-2 hover:bg-[#373e47] cursor-pointer text-red-400">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
