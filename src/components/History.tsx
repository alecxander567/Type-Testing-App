import Navbar from "./component/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Zap,
  Target,
  Timer,
  Calendar,
  History as HistoryIcon,
  Trash,
} from "lucide-react";

// Typing Result Interface
interface TypingResult {
  wpm: number;
  accuracy: number;
  duration: number;
  created_at: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

function History() {
  // States
  const [results, setResults] = useState<TypingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  // Fetch typing history
  useEffect(() => {
    if (!username) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/results/?username=${username}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        setResults(res.data);
      } catch (error) {
        console.error("Failed to fetch typing history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [username]);

  return (
    <div className="flex flex-col h-screen bg-black text-blue-100">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-blue-400">
            <HistoryIcon className="w-7 h-7 text-blue-400" />
            Typing History
          </h1>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-red-500/40 transition-all duration-200">
            <Trash className="w-5 h-5" />
            Clear History
          </button>
        </div>

        {loading && <p className="text-blue-300">Loading typing history...</p>}

        {!loading && results.length === 0 && (
          <p className="text-blue-300">No typing tests yet.</p>
        )}

        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="
          bg-zinc-900 
          border border-blue-500/30 
          rounded-2xl 
          p-8 md:p-10 
          shadow-xl
          hover:shadow-blue-500/30 
          transition-all duration-300
          flex flex-col md:flex-row md:items-center md:justify-between 
          gap-6
        ">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
                <div className="flex items-center gap-4">
                  <Zap className="w-7 h-7 text-blue-400" />
                  <div>
                    <p className="text-sm uppercase tracking-wide text-blue-200/60">
                      WPM
                    </p>
                    <p className="text-2xl font-bold text-blue-300">
                      {result.wpm}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Target className="w-7 h-7 text-emerald-400" />
                  <div>
                    <p className="text-sm uppercase tracking-wide text-blue-200/60">
                      Accuracy
                    </p>
                    <p className="text-2xl font-bold text-blue-300">
                      {result.accuracy}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Timer className="w-7 h-7 text-violet-400" />
                  <div>
                    <p className="text-sm uppercase tracking-wide text-blue-200/60">
                      Duration
                    </p>
                    <p className="text-2xl font-bold text-blue-300">
                      {result.duration}s
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <HistoryIcon className="w-7 h-7 text-yellow-400" />
                  <div>
                    <p className="text-sm uppercase tracking-wide text-blue-200/60">
                      Difficulty
                    </p>
                    <p className="text-2xl font-bold text-blue-300">
                      {result.difficulty}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-base text-blue-400/70">
                <Calendar className="w-5 h-5" />
                {new Date(result.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-80 md:w-96 flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-blue-400">
              <Trash className="w-5 h-5 text-blue-400" />
              Confirm Delete
            </h2>
            <p className="text-blue-200/70">
              Are you sure you want to clear your typing history? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition">
                Cancel
              </button>

              <button
                // Delete History
                onClick={async () => {
                  try {
                    await axios.delete(
                      "http://localhost:8000/api/results/clear/",
                      {
                        headers: {
                          Authorization: `Token ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                        data: { username },
                      }
                    );

                    setResults([]);
                    setShowConfirmModal(false);
                  } catch (error) {
                    console.error("Failed to clear typing history", error);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
