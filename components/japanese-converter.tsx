"use client";

import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableCharacter } from "./draggable-character";
import { DropZone } from "./drop-zone";
import { toast, Toaster } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { useViewportSize, useMediaQuery } from "@mantine/hooks";
import { INITIAL_CHARACTERS, type Character } from "@/lib/characters";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type ModeType = "romaji-hiragana" | "romaji-katakana" | "hiragana-katakana";
type GameMode = "random" | "ordered";

export function JapaneseConverter() {
  const [mode, setMode] = useState<ModeType>("romaji-hiragana");
  const [gameMode, setGameMode] = useState<GameMode>("random");
  const [score, setScore] = useState(0);
  const [matchedChars, setMatchedChars] = useState<Set<string>>(new Set());
  const [sourceOrder, setSourceOrder] = useState(() =>
    shuffleArray(INITIAL_CHARACTERS)
  );
  const [dropOrder, setDropOrder] = useState(() =>
    shuffleArray(INITIAL_CHARACTERS)
  );
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  // Add new states
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { width } = useViewportSize();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsPlaying(true);
    setElapsedTime(0);
    setScore(0);
    setMatchedChars(new Set());
    
    // Always shuffle source characters
    setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
    
    // Only shuffle drop zone if gameMode is random
    if (gameMode === "random") {
      setDropOrder(shuffleArray(INITIAL_CHARACTERS));
    } else {
      setDropOrder([...INITIAL_CHARACTERS]);
    }
    
    toast.success("Game started! Good luck!", {
      className: "bg-green-50 text-green-800 border-green-200",
      duration: 2000,
    });
  };

  const handleCharacterSelect = (charId: string) => {
    setSelectedChar(charId);

    if (isMobile) {
      // @ts-ignore
      dropZoneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleCorrectDrop = (charId: string) => {
    setMatchedChars((prev) => new Set([...prev, charId]));
    setScore((prev) => prev + 1);
    setSelectedChar(null);
    
    // Enhanced success toast
    toast.success(
      <div className="flex items-center gap-2">
        <span className="text-lg">🎯</span>
        <div>
          <p className="font-medium">Correct match!</p>
          <p className="text-sm text-green-800 dark:text-green-200">
            {score + 1} of {INITIAL_CHARACTERS.length} completed
          </p>
        </div>
      </div>,
      {
        className: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
        duration: 1500,
      }
    );

    // Check if game is complete
    if (score + 1 === INITIAL_CHARACTERS.length) {
      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-lg">🎊</span>
          <div>
            <p className="font-medium">Congratulations!</p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Completed in {formatTime(elapsedTime)}
            </p>
          </div>
        </div>,
        {
          className: "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-800",
          duration: 3000,
        }
      );
    }
  };

  const handleDropZoneClick = (charId: string) => {
    if (!selectedChar) return;

    if (selectedChar === charId) {
      handleCorrectDrop(charId);
    } else {
      setSelectedChar(null);
      // Enhanced error toast
      toast.error(
        <div className="flex items-center gap-2">
          <span className="text-lg">❌</span>
          <div>
            <p className="font-medium">Try again!</p>
            <p className="text-sm text-red-800 dark:text-red-200">
              That's not the right match
            </p>
          </div>
        </div>,
        {
          className: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800",
          duration: 1500,
        }
      );
    }
  };

  const handleModeChange = (newMode: ModeType) => {
    if (isPlaying) {
      toast.promise(
        new Promise((resolve, reject) => {
          const confirmed = (globalThis as any).confirm(
            "Changing mode will reset your progress. Continue?"
          );
          if (confirmed) {
            resolve(true);
          } else {
            reject();
          }
        }),
        {
          loading: "Confirming...",
          success: () => {
            setMode(newMode);
            setScore(0);
            setMatchedChars(new Set());
            setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
            setDropOrder(shuffleArray(INITIAL_CHARACTERS));
            return "Mode changed! Ready to start.";
          },
          error: "Mode change cancelled",
        }
      );
      return;
    }

    setMode(newMode);
    setScore(0);
    setMatchedChars(new Set());
    setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
    setDropOrder(shuffleArray(INITIAL_CHARACTERS));
    toast.info("Mode changed! Ready to start.", {
      className: "bg-blue-50 text-blue-800 border-blue-200",
      duration: 2000,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        <div className="w-full mx-auto px-4 py-4">
          <div className="rounded-3xl p-6 min-h-[calc(100vh-120px)]">
            <div className="space-y-4 max-w-[520px] mx-auto">

              {isPlaying && (
                <button
                  onClick={() => {
                    if (isPlaying) {
                      setIsPlaying(false);
                      setElapsedTime(0);
                      setScore(0);
                      setMatchedChars(new Set());
                    } else {
                      setIsPlaying(true);
                    }
                  }}
                  className={`w-full py-3 rounded-2xl text-sm font-medium text-white
                  ${isPlaying ? "bg-rose-500" : "bg-violet-500"}`}
                >
                  {"Stop"}
                </button>
              )}

              {isPlaying && (
                <div className="flex items-center gap-3">
                  <div
                    className="font-mono text-sm px-4 py-2.5 
                    bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                    rounded-xl text-center flex-1"
                  >
                    {formatTime(elapsedTime)}
                  </div>
                  <div
                    className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 
                    text-black dark:text-white rounded-xl text-sm text-center flex-1"
                  >
                    {score} / {INITIAL_CHARACTERS.length}
                  </div>
                </div>
              )}
            </div>

            {isPlaying && (
              <div className="space-y-4 mt-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 md:p-8">
                  <h2 className="text-sm font-normal mb-4 text-neutral-600 dark:text-neutral-400">
                    Source Characters
                  </h2>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-x-8 md:gap-y-6">
                    {sourceOrder.map(
                      (char) =>
                        !matchedChars.has(char.id) && (
                          <DraggableCharacter
                            key={char.id}
                            character={char}
                            mode={mode}
                            isSelected={selectedChar === char.id}
                            onSelect={handleCharacterSelect}
                          />
                        )
                    )}
                  </div>
                </div>

                <div
                  ref={dropZoneRef}
                  className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 md:p-8"
                >
                  <h2 className="text-sm font-normal mb-4 text-neutral-600 dark:text-neutral-400">
                    Drop Zone
                  </h2>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-x-8 md:gap-y-6">
                    {dropOrder.map((char) => (
                      <DropZone
                        key={char.id}
                        character={char}
                        mode={mode}
                        isMatched={matchedChars.has(char.id)}
                        isActive={selectedChar !== null}
                        onZoneClick={() => handleDropZoneClick(char.id)}
                        onCorrectDrop={() => handleCorrectDrop(char.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!isPlaying && (
              <div className="mt-12 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-3 text-4xl">
                    <span>あ</span>
                    <span>ア</span>
                    <span>A</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-medium">
                      Learn Japanese Writing System
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Master Hiragana and Katakana through interactive exercises
                    </p>
                  </div>

                  <div className="w-full max-w-[520px] space-y-4">
                    <select
                      className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                        rounded-2xl px-4 py-3 focus:outline-none 
                        border border-neutral-200 dark:border-neutral-800"
                      value={mode}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleModeChange((e.target as any).value as ModeType)
                      }
                    >
                      <option value="romaji-hiragana">Romaji → Hiragana</option>
                      <option value="romaji-katakana">Romaji → Katakana</option>
                      <option value="hiragana-katakana">Hiragana ↔ Katakana</option>
                    </select>

                    <select
                      className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                        rounded-2xl px-4 py-3 focus:outline-none 
                        border border-neutral-200 dark:border-neutral-800"
                      value={gameMode}
                      onChange={(e) => setGameMode((e.target as any).value as GameMode)}
                    >
                      <option value="random">Random Order</option>
                      <option value="ordered">Sequential Order</option>
                    </select>

                    <button
                      onClick={handleStart}
                      className="w-full py-3 rounded-2xl text-sm font-medium text-white
                        bg-violet-500 hover:bg-violet-600 transition-colors"
                    >
                      Start Learning
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 w-full max-w-[520px] mt-4">
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 text-center">
                      <div className="text-2xl text-neutral-950 mb-1">ひ</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Hiragana
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 text-center">
                      <div className="text-2xl text-neutral-950 mb-1">カ</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Katakana
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 text-center">
                      <div className="text-2xl text-neutral-950  mb-1">A</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Romaji
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
