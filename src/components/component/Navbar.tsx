import { Home, Clock, User, LogOut, Keyboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Navbar() {
  // Router DOM
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items navbar
  const menuItems = [
    { name: "Home", icon: <Home />, path: "/home" },
    { name: "History", icon: <Clock />, path: "/history" },
    { name: "Profile", icon: <User />, path: "/profile" },
  ];

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="flex items-center justify-between bg-zinc-950 border-b border-blue-500/20 px-6 py-4 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
      <div className="flex items-center gap-2 text-2xl font-bold text-blue-400">
        <Keyboard size={24} />
        <span>TypeTest App</span>
      </div>

      <nav className="flex items-center gap-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-3 py-1 rounded transition ${
                isActive
                  ? "text-blue-400 bg-blue-500/20"
                  : "text-blue-300 hover:text-blue-400"
              }`}>
              {item.icon}
              <span>{item.name}</span>
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 transition px-3 py-1 rounded">
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
