import { Home, Clock, User, LogOut, Keyboard, Zap } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
} from "recharts";

function Homepage() {
  // Active menu items
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // States
  const [username, setUsername] = useState<string>("");

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

  // Menu items navbar
  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "History", icon: <Clock size={18} /> },
    { name: "Profile", icon: <User size={18} /> },
  ];

  // Sample data
  const typingData = [
    { test: "Test 1", wpm: 65 },
    { test: "Test 2", wpm: 70 },
    { test: "Test 3", wpm: 72 },
    { test: "Test 4", wpm: 68 },
    { test: "Test 5", wpm: 75 },
    { test: "Test 6", wpm: 73 },
    { test: "Test 7", wpm: 72 },
  ];

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-blue-100">
      <header className="flex items-center justify-between bg-zinc-950 border-b border-blue-500/20 px-6 py-4 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-400">
          <Keyboard size={24} />
          <span>TypeTest App</span>
        </div>

        <nav className="flex items-center gap-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`flex items-center gap-2 px-3 py-1 rounded transition ${
                activeMenu === item.name
                  ? "text-blue-400 bg-blue-500/20"
                  : "text-blue-300 hover:text-blue-400"
              }`}>
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 transition px-3 py-1 rounded">
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">
              Welcome <span className="text-blue-300">{username}</span>👋
            </h1>
            <p className="text-blue-200/70 mt-1 md:mt-2">
              Start a typing test or check your performance analytics.
            </p>
          </div>

          <button
            onClick={() => console.log("Start typing clicked")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-shadow shadow-md hover:shadow-lg">
            <Keyboard size={20} />
            Start Typing
          </button>
        </div>

        <div className="p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 mb-6 md:mb-8 bg-zinc-900">
          <h2 className="flex items-center text-xl font-semibold text-blue-400 mb-4">
            <Zap className="w-6 h-6 mr-2 text-blue-400" />
            Typing Speed Over Time
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={typingData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>

                <linearGradient
                  id="chartBgGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#chartBgGradient)"
              />

              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="test" stroke="#60a5fa" fontSize={12} />
              <YAxis
                stroke="#60a5fa"
                fontSize={12}
                domain={[0, "dataMax + 5"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                }}
                itemStyle={{ color: "#60a5fa" }}
                labelStyle={{ color: "#60a5fa" }}
              />

              <Area
                type="monotone"
                dataKey="wpm"
                stroke="none"
                fill="url(#wpmGradient)"
              />

              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#60a5fa" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-zinc-900 p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Average WPM
            </h2>
            <p className="text-3xl font-bold text-blue-300">72</p>
            <p className="text-blue-200/70 mt-1">Words per minute</p>
          </div>

          <div className="bg-zinc-900 p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Accuracy
            </h2>
            <p className="text-3xl font-bold text-blue-300">95%</p>
            <p className="text-blue-200/70 mt-1">Correct keystrokes</p>
          </div>

          <div className="bg-zinc-900 p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Tests Taken
            </h2>
            <p className="text-3xl font-bold text-blue-300">12</p>
            <p className="text-blue-200/70 mt-1">Completed sessions</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Homepage;
