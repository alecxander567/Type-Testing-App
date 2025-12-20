import { useEffect, useState } from "react";
import axios from "axios";

export function useTypingTest(username: string) {
  // States
  const [typingText, setTypingText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  // Start the typing test
  const startTest = () => {
    setTimeLeft(60);
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setInputValue("");
    setIsRunning(true);
    fetchTypingText();
  };

  // Fetch typing text from API
  const fetchTypingText = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/typing-text/?difficulty=easy"
      );

      if (!res.ok) {
        throw new Error("Failed to fetch typing text");
      }

      const data = await res.json();
      setTypingText(data.content ?? "");
    } catch (error) {
      console.error("Typing text fetch failed:", error);
      setTypingText("");
    }
  };

  // Typing handler
  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== " ") return;
    e.preventDefault();

    const words = typingText.split(" ");
    if (inputValue.trim() === words[currentWordIndex]) {
      setCorrectWords((c) => c + 1);
    }

    const nextIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextIndex);
    setInputValue("");

    if (nextIndex >= words.length) {
      const elapsed = 60 - timeLeft;
      endTest(elapsed);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Calculate WPM and Accuracy
  const wpm = Math.round((correctWords / 60) * 60);
  const accuracy =
    currentWordIndex === 0
      ? 100
      : Math.round((correctWords / currentWordIndex) * 100);

  // End test and save results
  const endTest = async (elapsedSeconds?: number) => {
    setIsRunning(false);

    const duration = elapsedSeconds ?? 60;

    try {
      await axios.post("http://localhost:8000/api/results/save/", {
        username,
        wpm,
        accuracy,
        duration,
      });
    } catch (err) {
      console.error("Failed to save typing result:", err);
    }
  };

  // Auto end test when time is up
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      endTest(60);
    }
  }, [timeLeft, isRunning]);

  return {
    typingText,
    inputValue,
    setInputValue,
    handleTyping,
    timeLeft,
    wpm,
    accuracy,
    startTest,
  };
}
