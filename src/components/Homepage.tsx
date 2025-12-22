import { Keyboard, Zap, User } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTypingTest } from "./hooks/useTypingTest";
import TypingTestModal from "./component/TypingTestModal";
import { useTypingStats } from "./hooks/useTypingStats";
import Navbar from "./component/Navbar";

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
  // States
  const [username, setUsername] = useState<string>("");
  const [typingData, setTypingData] = useState<{ test: string; wpm: number }[]>(
    []
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Call the typing stats hook
  const { averageWpm, averageAccuracy, testsTaken, mostPlayedDifficulty } =
    useTypingStats(username);

  // Modals state
  const [showTypingModal, setShowTypingModal] = useState(false);

  // Call the typing test hook
  const typing = useTypingTest(username);

  // Fetch typing results for line chart
  useEffect(() => {
    if (!username) return;

    let intervalId: number;

    const fetchTypingResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/results/?username=${username}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data.map((result: any, index: number) => ({
          test: `Test ${index + 1}`,
          wpm: result.wpm,
        }));

        setTypingData(data);
      } catch (error) {
        console.error("Failed to fetch typing results", error);
      }
    };

    fetchTypingResults();

    intervalId = window.setInterval(fetchTypingResults, 3000);

    return () => clearInterval(intervalId);
  }, [username]);

  // Fetch username on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Fetch profile image
  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/profile/?username=${username}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.profile_image) {
          setProfileImage(`http://localhost:8000${data.profile_image}`);
        } else {
          setProfileImage(null);
        }
      } catch (err) {
        console.error("Failed to fetch profile image", err);
        setProfileImage(null);
      }
    };

    fetchProfile();
  }, [username]);

  return (
    <div className="flex flex-col h-screen bg-black text-blue-100">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-blue-500">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-blue-400" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-blue-400">
                Welcome <span className="text-blue-300">{username}</span>👋
              </h1>
              <p className="text-blue-200/70 mt-1 md:mt-2">
                Start a typing test or check your performance analytics.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowTypingModal(true);
              typing.startTest();
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 text-lg">
            <Keyboard className="w-6 h-6" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-zinc-900 p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Average WPM
            </h2>
            <p className="text-3xl font-bold text-blue-300">{averageWpm}</p>
            <p className="text-blue-200/70 mt-1">Words per minute</p>
          </div>
          <div className="bg-zinc-900 p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Accuracy
            </h2>
            <p className="text-3xl font-bold text-blue-300">
              {averageAccuracy}%
            </p>
            <p className="text-blue-200/70 mt-1">Correct keystrokes</p>
          </div>
          <div className="bg-zinc-900 p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Tests Taken
            </h2>
            <p className="text-3xl font-bold text-blue-300">{testsTaken}</p>
            <p className="text-blue-200/70 mt-1">Completed sessions</p>
          </div>
          <div className="bg-zinc-900 p-4 md:p-6 rounded-xl shadow-lg border border-blue-500/20 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              Most Played
            </h2>
            <p className="text-3xl font-bold text-blue-300">
              {mostPlayedDifficulty}
            </p>
            <p className="text-blue-200/70 mt-1">Preferred difficulty</p>
          </div>
        </div>
      </main>

      <TypingTestModal
        isOpen={showTypingModal}
        onClose={() => setShowTypingModal(false)}
        typing={typing}
      />
    </div>
  );
}

export default Homepage;
