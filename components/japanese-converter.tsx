"use client";

import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableCharacter } from "./draggable-character";
import { DropZone } from "./drop-zone";
import { toast, Toaster } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { useViewportSize, useMediaQuery } from "@mantine/hooks";

interface Character {
  id: string;
  romaji: string;
  hiragana: string;
  katakana: string;
}

export const INITIAL_CHARACTERS: Character[] = [
  // Vowels
  { id: "a", romaji: "a", hiragana: "あ", katakana: "ア" },
  { id: "i", romaji: "i", hiragana: "い", katakana: "イ" },
  { id: "u", romaji: "u", hiragana: "う", katakana: "ウ" },
  { id: "e", romaji: "e", hiragana: "え", katakana: "エ" },
  { id: "o", romaji: "o", hiragana: "お", katakana: "オ" },

  // K-series
  { id: "ka", romaji: "ka", hiragana: "か", katakana: "カ" },
  { id: "ki", romaji: "ki", hiragana: "き", katakana: "キ" },
  { id: "ku", romaji: "ku", hiragana: "く", katakana: "ク" },
  { id: "ke", romaji: "ke", hiragana: "け", katakana: "ケ" },
  { id: "ko", romaji: "ko", hiragana: "こ", katakana: "コ" },

  // S-series
  { id: "sa", romaji: "sa", hiragana: "さ", katakana: "サ" },
  { id: "shi", romaji: "shi", hiragana: "し", katakana: "シ" },
  { id: "su", romaji: "su", hiragana: "す", katakana: "ス" },
  { id: "se", romaji: "se", hiragana: "せ", katakana: "セ" },
  { id: "so", romaji: "so", hiragana: "そ", katakana: "ソ" },

  // T-series
  { id: "ta", romaji: "ta", hiragana: "た", katakana: "タ" },
  { id: "chi", romaji: "chi", hiragana: "ち", katakana: "チ" },
  { id: "tsu", romaji: "tsu", hiragana: "つ", katakana: "ツ" },
  { id: "te", romaji: "te", hiragana: "て", katakana: "テ" },
  { id: "to", romaji: "to", hiragana: "と", katakana: "ト" },

  // N-series
  { id: "na", romaji: "na", hiragana: "な", katakana: "ナ" },
  { id: "ni", romaji: "ni", hiragana: "に", katakana: "ニ" },
  { id: "nu", romaji: "nu", hiragana: "ぬ", katakana: "ヌ" },
  { id: "ne", romaji: "ne", hiragana: "ね", katakana: "ネ" },
  { id: "no", romaji: "no", hiragana: "の", katakana: "ノ" },

  // H-series
  { id: "ha", romaji: "ha", hiragana: "は", katakana: "ハ" },
  { id: "hi", romaji: "hi", hiragana: "ひ", katakana: "ヒ" },
  { id: "fu", romaji: "fu", hiragana: "ふ", katakana: "フ" },
  { id: "he", romaji: "he", hiragana: "へ", katakana: "ヘ" },
  { id: "ho", romaji: "ho", hiragana: "ほ", katakana: "ホ" },

  // M-series
  { id: "ma", romaji: "ma", hiragana: "ま", katakana: "マ" },
  { id: "mi", romaji: "mi", hiragana: "み", katakana: "ミ" },
  { id: "mu", romaji: "mu", hiragana: "む", katakana: "ム" },
  { id: "me", romaji: "me", hiragana: "め", katakana: "メ" },
  { id: "mo", romaji: "mo", hiragana: "も", katakana: "モ" },

  // Y-series
  { id: "ya", romaji: "ya", hiragana: "や", katakana: "ヤ" },
  { id: "yu", romaji: "yu", hiragana: "ゆ", katakana: "ユ" },
  { id: "yo", romaji: "yo", hiragana: "よ", katakana: "ヨ" },

  // R-series
  { id: "ra", romaji: "ra", hiragana: "ら", katakana: "ラ" },
  { id: "ri", romaji: "ri", hiragana: "り", katakana: "リ" },
  { id: "ru", romaji: "ru", hiragana: "る", katakana: "ル" },
  { id: "re", romaji: "re", hiragana: "れ", katakana: "レ" },
  { id: "ro", romaji: "ro", hiragana: "ろ", katakana: "ロ" },

  // W-series
  { id: "wa", romaji: "wa", hiragana: "わ", katakana: "ワ" },
  { id: "wo", romaji: "wo", hiragana: "を", katakana: "ヲ" },

  // N
  { id: "n", romaji: "n", hiragana: "ん", katakana: "ン" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type ModeType = "romaji-hiragana" | "romaji-katakana" | "hiragana-katakana";

export function JapaneseConverter() {
  const [mode, setMode] = useState<ModeType>("romaji-hiragana");
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
    setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
    setDropOrder(shuffleArray(INITIAL_CHARACTERS));
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
    toast.success("Correct match!", {
      className: "bg-green-50 text-green-800 border-green-200",
      duration: 1000,
    });

    // Check if game is complete
    if (score + 1 === INITIAL_CHARACTERS.length) {
      toast.success(
        `Congratulations! Completed in ${formatTime(elapsedTime)}!`,
        {
          className: "bg-purple-50 text-purple-800 border-purple-200",
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
      toast.error("Try again!", {
        className: "bg-red-50 text-red-800 border-red-200",
        duration: 1000,
      });
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
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="w-full max-w-full mx-auto px-4 py-4">

          <div className="bg-white dark:bg-black rounded-3xl p-6 min-h-[calc(100vh-120px)]">
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
              <div className="space-y-4 md:space-y-0 md:flex md:gap-12 mt-6">
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 md:p-16 md:flex-1">
                  <h2 className="text-sm font-normal mb-4 text-neutral-600 dark:text-neutral-400">
                    Source Characters
                  </h2>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-x-12 md:gap-y-8">
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
                  className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 md:p-16 md:flex-1"
                >
                  <h2 className="text-sm font-normal mb-4 text-neutral-600 dark:text-neutral-400">
                    Drop Zone
                  </h2>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-x-12 md:gap-y-8">
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
                    <h2 className="text-2xl font-medium text-black dark:text-white">
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
                      <option value="hiragana-katakana">
                        Hiragana ↔ Katakana
                      </option>
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
                      <div className="text-2xl mb-1">ひ</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Hiragana
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 text-center">
                      <div className="text-2xl mb-1">カ</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Katakana
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 text-center">
                      <div className="text-2xl mb-1">A</div>
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
