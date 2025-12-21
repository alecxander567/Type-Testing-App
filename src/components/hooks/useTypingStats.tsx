import { useEffect, useState } from "react";
import axios from "axios";

export function useTypingStats(username: string, difficulty: string = "Easy") {
  // States
  const [results, setResults] = useState<
    { wpm: number; accuracy: number; difficulty: string }[]
  >([]);
  const [averageWpm, setAverageWpm] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [mostPlayedDifficulty, setMostPlayedDifficulty] = useState("N/A");

  // Fetch results effect
  useEffect(() => {
    if (!username) return;

    let intervalId: number;

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/results/?username=${username}`
        );

        setResults(res.data);

        if (res.data.length > 0) {
          const totalWpm = res.data.reduce(
            (acc: number, r: any) => acc + r.wpm,
            0
          );
          const totalAccuracy = res.data.reduce(
            (acc: number, r: any) => acc + r.accuracy,
            0
          );

          setAverageWpm(Math.round(totalWpm / res.data.length));
          setAverageAccuracy(Math.round(totalAccuracy / res.data.length));

          const difficultyCount: Record<string, number> = {};
          res.data.forEach((r: any) => {
            difficultyCount[r.difficulty] =
              (difficultyCount[r.difficulty] || 0) + 1;
          });

          const mostPlayed = Object.entries(difficultyCount).reduce((a, b) =>
            a[1] > b[1] ? a : b
          );

          setMostPlayedDifficulty(mostPlayed[0]);
        } else {
          setAverageWpm(0);
          setAverageAccuracy(0);
          setMostPlayedDifficulty("N/A");
        }
      } catch (err) {
        console.error("Failed to fetch typing results:", err);
        setResults([]);
        setAverageWpm(0);
        setAverageAccuracy(0);
        setMostPlayedDifficulty("N/A");
      }
    };

    fetchResults();

    intervalId = window.setInterval(fetchResults, 3000);

    return () => clearInterval(intervalId);
  }, [username]);

  return {
    results,
    averageWpm,
    averageAccuracy,
    testsTaken: results.length,
    mostPlayedDifficulty,
  };
}
