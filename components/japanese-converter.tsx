"use client";

import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableCharacter } from "./draggable-character";
import { DropZone } from "./drop-zone";
import { toast, Toaster } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { useViewportSize, useMediaQuery } from "@mantine/hooks";
import { INITIAL_CHARACTERS, DAKUON_CHARACTERS, type Character } from "@/lib/characters";

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
type CharacterSet = "basic" | "dakuon" | "all" | "custom";

export function JapaneseConverter() {
  const [mode, setMode] = useState<ModeType>("romaji-hiragana");
  const [gameMode, setGameMode] = useState<GameMode>("random");
  const [characterSet, setCharacterSet] = useState<CharacterSet>("basic");
  const [basicCount, setBasicCount] = useState(5);
  const [dakuonCount, setDakuonCount] = useState(5);
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

  const getActiveCharacters = () => {
    switch (characterSet) {
      case "basic":
        return INITIAL_CHARACTERS;
      case "dakuon":
        return DAKUON_CHARACTERS;
      case "all":
        return [...INITIAL_CHARACTERS, ...DAKUON_CHARACTERS];
      case "custom":
        const shuffledBasic = shuffleArray(INITIAL_CHARACTERS).slice(0, basicCount);
        const shuffledDakuon = shuffleArray(DAKUON_CHARACTERS).slice(0, dakuonCount);
        return [...shuffledBasic, ...shuffledDakuon];
      default:
        return INITIAL_CHARACTERS;
    }
  };

  const handleStart = () => {
    const activeChars = getActiveCharacters();
    setIsPlaying(true);
    setElapsedTime(0);
    setScore(0);
    setMatchedChars(new Set());
    setSelectedChar(null);
    
    // Set initial source and drop orders
    setSourceOrder(shuffleArray(activeChars));
    setDropOrder(gameMode === "random" ? shuffleArray(activeChars) : [...activeChars]);
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
    const activeChars = getActiveCharacters();
    setMatchedChars((prev) => new Set([...prev, charId]));
    setScore((prev) => prev + 1);
    setSelectedChar(null);
    
    // Enhanced success toast with correct total count
    toast.success(
      <div className="flex items-center gap-2">
        <span className="text-lg">🎯</span>
        <div>
          <p className="font-medium">Correct match!</p>
          <p className="text-sm text-green-800 dark:text-green-200">
            {score + 1} of {activeChars.length} completed
          </p>
        </div>
      </div>,
      {
        className: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
        duration: 1500,
      }
    );

    // Check if game is complete with correct total count
    if (score + 1 === activeChars.length) {
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
      setIsPlaying(false);
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
                    {score} / {getActiveCharacters().length}
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
                    {sourceOrder
                      .filter(char => !matchedChars.has(char.id))
                      .map(char => (
                        <DraggableCharacter
                          key={char.id}
                          character={char}
                          mode={mode}
                          isSelected={selectedChar === char.id}
                          onSelect={handleCharacterSelect}
                        />
                      ))}
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
              <div className="mt-12">
                <div className="max-w-[600px] mx-auto bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-8">
                  <div className="text-center space-y-3">
                    <div className="flex gap-3 text-4xl justify-center">
                      <span className="bg-gradient-to-br from-violet-600 to-pink-600 bg-clip-text text-transparent">あ</span>
                      <span className="bg-gradient-to-br from-violet-600 to-pink-600 bg-clip-text text-transparent">ア</span>
                      <span className="bg-gradient-to-br from-violet-600 to-pink-600 bg-clip-text text-transparent">A</span>
                    </div>

                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                      Japanese Writing System
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Master Hiragana and Katakana through interactive exercises
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                        Exercise Mode
                      </label>
                      <select
                        className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                          rounded-2xl px-4 py-3 focus:outline-none group-hover:ring-2 ring-violet-200
                          border border-neutral-200 dark:border-neutral-700 transition-all"
                        value={mode}
                        onChange={(e) => handleModeChange(e.target.value as ModeType)}
                      >
                        <option value="romaji-hiragana">Romaji → Hiragana</option>
                        <option value="romaji-katakana">Romaji → Katakana</option>
                        <option value="hiragana-katakana">Hiragana ↔ Katakana</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                        Character Set
                      </label>
                      <select
                        className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                          rounded-2xl px-4 py-3 focus:outline-none group-hover:ring-2 ring-violet-200
                          border border-neutral-200 dark:border-neutral-700 transition-all"
                        value={characterSet}
                        onChange={(e) => setCharacterSet(e.target.value as CharacterSet)}
                      >
                        <option value="basic">Basic Characters (46)</option>
                        <option value="dakuon">Dakuon Characters (25)</option>
                        <option value="all">All Characters (71)</option>
                        <option value="custom">Custom Selection</option>
                      </select>
                    </div>

                    {characterSet === "custom" && (
                      <div className="space-y-4">
                        <div className="group">
                          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                            Basic Characters (1-46)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="46"
                            value={basicCount}
                            onChange={(e) => setBasicCount(Math.min(46, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                              rounded-2xl px-4 py-3 focus:outline-none group-hover:ring-2 ring-violet-200
                              border border-neutral-200 dark:border-neutral-700 transition-all"
                          />
                        </div>
                        
                        <div className="group">
                          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                            Dakuon Characters (1-25)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="25"
                            value={dakuonCount}
                            onChange={(e) => setDakuonCount(Math.min(25, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                              rounded-2xl px-4 py-3 focus:outline-none group-hover:ring-2 ring-violet-200
                              border border-neutral-200 dark:border-neutral-700 transition-all"
                          />
                        </div>

                        <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                          Total characters: {basicCount + dakuonCount}
                        </div>
                      </div>
                    )}

                    <div className="group">
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                        Order Mode
                      </label>
                      <select
                        className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                          rounded-2xl px-4 py-3 focus:outline-none group-hover:ring-2 ring-violet-200
                          border border-neutral-200 dark:border-neutral-700 transition-all"
                        value={gameMode}
                        onChange={(e) => setGameMode(e.target.value as GameMode)}
                      >
                        <option value="random">Random Order</option>
                        <option value="ordered">Sequential Order</option>
                      </select>
                    </div>

                    <button
                      onClick={handleStart}
                      className="w-full py-4 rounded-2xl text-lg font-medium text-white
                        bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 
                        hover:to-pink-600 transition-all shadow-lg shadow-violet-500/20"
                    >
                      Start Learning
                    </button>
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
