"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableCharacter } from "./draggable-character";
import { DropZone } from "./drop-zone";
import { toast, Toaster } from "sonner";
import { ThemeToggle } from "./theme-toggle";

interface Character {
  id: string;
  romaji: string;
  hiragana: string;
  katakana: string;
}

const INITIAL_CHARACTERS: Character[] = [
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

export function JapaneseConverter() {
  const [mode, setMode] = useState<"romaji-hiragana" | "romaji-katakana" | "hiragana-katakana" | "katakana-hiragana">("romaji-hiragana");
  const [score, setScore] = useState(0);
  const [matchedChars, setMatchedChars] = useState<Set<string>>(new Set());
  const [sourceOrder, setSourceOrder] = useState(() => shuffleArray(INITIAL_CHARACTERS));
  const [dropOrder, setDropOrder] = useState(() => shuffleArray(INITIAL_CHARACTERS));
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  
  // Add new states
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsPlaying(true);
    setElapsedTime(0);
    setScore(0);
    setMatchedChars(new Set());
    setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
    setDropOrder(shuffleArray(INITIAL_CHARACTERS));
    toast.success('Game started! Good luck!', {
      className: 'bg-green-50 text-green-800 border-green-200',
      duration: 2000,
    });
  };

  const handleCharacterSelect = (charId: string) => {
    setSelectedChar(charId);
  };

  const handleCorrectDrop = (charId: string) => {
    setMatchedChars(prev => new Set([...prev, charId]));
    setScore(prev => prev + 1);
    setSelectedChar(null);
    toast.success('Correct match!', {
      className: 'bg-green-50 text-green-800 border-green-200',
      duration: 1000,
    });

    // Check if game is complete
    if (score + 1 === INITIAL_CHARACTERS.length) {
      toast.success(`Congratulations! Completed in ${formatTime(elapsedTime)}!`, {
        className: 'bg-purple-50 text-purple-800 border-purple-200',
        duration: 3000,
      });
    }
  };

  const handleDropZoneClick = (charId: string) => {
    if (!selectedChar) return;
    
    if (selectedChar === charId) {
      handleCorrectDrop(charId);
    } else {
      setSelectedChar(null);
      toast.error('Try again!', {
        className: 'bg-red-50 text-red-800 border-red-200',
        duration: 1000,
      });
    }
  };

  const handleModeChange = (newMode: typeof mode) => {
    if (isPlaying) {
      toast.promise(
        new Promise((resolve, reject) => {
          const confirmed = (globalThis as any).confirm('Changing mode will reset your progress. Continue?');
          if (confirmed) {
            resolve(true);
          } else {
            reject();
          }
        }),
        {
          loading: 'Confirming...',
          success: () => {
            setMode(newMode);
            setScore(0);
            setMatchedChars(new Set());
            setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
            setDropOrder(shuffleArray(INITIAL_CHARACTERS));
            return 'Mode changed! Ready to start.';
          },
          error: 'Mode change cancelled',
        }
      );
      return;
    }
    
    setMode(newMode);
    setScore(0);
    setMatchedChars(new Set());
    setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
    setDropOrder(shuffleArray(INITIAL_CHARACTERS));
    toast.info('Mode changed! Ready to start.', {
      className: 'bg-blue-50 text-blue-800 border-blue-200',
      duration: 2000,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100 dark:from-black dark:to-neutral-950">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-medium bg-gradient-to-r from-neutral-800 to-neutral-600 
              dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              Japanese Writing System Converter
            </h1>
            <ThemeToggle />
          </div>
          
          <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-6 
            shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-15px_rgba(255,255,255,0.1)] mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <select
                className="bg-white dark:bg-neutral-800 text-sm rounded-2xl px-6 py-3
                  focus:outline-none focus:ring-2 focus:ring-violet-500/20 shadow-sm
                  border border-neutral-200/50 dark:border-neutral-700/50
                  hover:border-violet-500/30 dark:hover:border-violet-500/30 transition-colors"
                value={mode}
                onChange={(e) => handleModeChange((e.target as any).value as typeof mode)}
                disabled={isPlaying}
              >
                <option value="romaji-hiragana">Romaji → Hiragana</option>
                <option value="romaji-katakana">Romaji → Katakana</option>
                <option value="hiragana-katakana">Hiragana ↔ Katakana</option>
              </select>

              <div className="flex items-center gap-4">
                {isPlaying && (
                  <div className="font-mono text-sm px-6 py-3 bg-white dark:bg-neutral-800 
                    rounded-2xl shadow-sm border border-neutral-200/50 dark:border-neutral-700/50">
                    {formatTime(elapsedTime)}
                  </div>
                )}
                
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
                  className={`px-8 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all
                    active:scale-95 hover:shadow-md
                    ${isPlaying 
                      ? "bg-rose-500 text-white hover:bg-rose-600" 
                      : "bg-violet-500 text-white hover:bg-violet-600"
                    }`}
                >
                  {isPlaying ? "Stop" : "Start"}
                </button>

                <div className="flex items-center gap-3">
                  <div className="px-6 py-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm 
                    text-sm border border-neutral-200/50 dark:border-neutral-700/50">
                    {score} / {INITIAL_CHARACTERS.length}
                  </div>
                  <div className="px-6 py-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm 
                    text-sm border border-neutral-200/50 dark:border-neutral-700/50">
                    {Math.round((score / INITIAL_CHARACTERS.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isPlaying ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-8 
                shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-15px_rgba(255,255,255,0.1)]">
                <h2 className="text-sm font-medium mb-8 text-neutral-500 dark:text-neutral-400 
                  flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                  Source Characters
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {sourceOrder.map((char) => (
                    !matchedChars.has(char.id) && (
                      <DraggableCharacter
                        key={char.id}
                        character={char}
                        mode={mode}
                        isSelected={selectedChar === char.id}
                        onSelect={handleCharacterSelect}
                      />
                    )
                  ))}
                </div>
              </div>
              <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-3xl p-8 
                shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-15px_rgba(255,255,255,0.1)]">
                <h2 className="text-sm font-medium mb-8 text-neutral-500 dark:text-neutral-400
                  flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  Drop Zone
                </h2>
                <div className="grid grid-cols-4 gap-4">
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
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-rose-500 
                  rounded-3xl opacity-20 blur-xl animate-pulse"></div>
                <div className="relative bg-white dark:bg-neutral-900 rounded-3xl p-8 text-center">
                  <div className="flex flex-col items-center gap-2 mb-6">
                    <span className="text-4xl">🎌</span>
                    <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
                      Ready to Learn Japanese?
                    </h2>
                  </div>
                  
                  <div className="space-y-4 mb-8 max-w-md mx-auto">
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Practice matching Japanese characters in an interactive way.
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                      <div className="flex items-center gap-2 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        Select your preferred mode
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        Click Start to begin the game
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        Match the characters by dragging or clicking
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPlaying(true)}
                    className="px-8 py-3 bg-violet-500 text-white rounded-xl font-medium
                      hover:bg-violet-600 transition-all active:scale-95 shadow-lg
                      hover:shadow-violet-500/25"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
} 