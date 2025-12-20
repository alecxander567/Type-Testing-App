import { X, Timer, Zap, Target } from "lucide-react";

// Props interface
interface TypingModalProps {
  isOpen: boolean;
  onClose: () => void;
  typing: any;
}

export default function TypingTestModal({
  isOpen,
  onClose,
  typing,
}: TypingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}>
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-blue-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
        onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-6 top-6 rounded-full p-2 text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300 hover:rotate-90"
          onClick={onClose}>
          <X size={24} />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-blue-400 mb-2">Typing Test</h2>
          <p className="text-blue-300/60 text-sm">
            Type the words below as fast and accurately as you can
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-zinc-950/50 p-6 text-lg leading-relaxed shadow-inner backdrop-blur-sm min-h-[120px] flex items-center">
          {typing.typingText ? (
            <div className="w-full">
              {typing.typingText
                .split(" ")
                .filter(Boolean)
                .map((word: string, i: number) => (
                  <span
                    key={i}
                    className="mr-2 text-blue-200 transition-colors duration-150">
                    {word}
                  </span>
                ))}
            </div>
          ) : (
            <div className="w-full text-center text-blue-400/60 animate-pulse">
              Loading text...
            </div>
          )}
        </div>

        <input
          value={typing.inputValue}
          onChange={(e) => typing.setInputValue(e.target.value)}
          onKeyDown={typing.handleTyping}
          autoFocus
          disabled={!typing.typingText}
          placeholder={
            typing.typingText ? "Start typing..." : "Loading words..."
          }
          className="w-full rounded-xl border border-blue-500/40 bg-zinc-950/80 p-4 text-lg text-blue-100 placeholder:text-blue-400/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center rounded-xl border border-blue-500/20 bg-zinc-950/50 p-4 backdrop-blur-sm">
            <div className="mb-2 rounded-full bg-blue-500/20 p-2">
              <Timer className="text-blue-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-blue-300">
              {typing.timeLeft}s
            </span>
            <span className="text-xs text-blue-400/60">Time Left</span>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-blue-500/20 bg-zinc-950/50 p-4 backdrop-blur-sm">
            <div className="mb-2 rounded-full bg-blue-500/20 p-2">
              <Zap className="text-blue-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-blue-300">
              {typing.wpm}
            </span>
            <span className="text-xs text-blue-400/60">WPM</span>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-blue-500/20 bg-zinc-950/50 p-4 backdrop-blur-sm">
            <div className="mb-2 rounded-full bg-blue-500/20 p-2">
              <Target className="text-blue-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-blue-300">
              {typing.accuracy}%
            </span>
            <span className="text-xs text-blue-400/60">Accuracy</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 ease-out"
              style={{ width: `${((60 - typing.timeLeft) / 60) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
