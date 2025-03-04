"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableCharacter } from "./draggable-character";
import { DropZone } from "./drop-zone";
import { toast, Toaster } from "sonner";

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
      <div className="min-h-screen bg-neutral-950 text-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-medium text-center mb-12">
            Japanese Writing System Converter
          </h1>
          
          <div className="flex items-center justify-between gap-4 mb-8 bg-neutral-900 rounded-xl p-4">
            <select
              className="bg-neutral-800 text-sm rounded-lg px-4 py-2.5 
                focus:outline-none border border-neutral-700"
              value={mode}
              onChange={(e) => handleModeChange((e.target as any).value as typeof mode)}
              disabled={isPlaying}
            >
              <option value="romaji-hiragana">Romaji → Hiragana</option>
              <option value="romaji-katakana">Romaji → Katakana</option>
              <option value="hiragana-katakana">Hiragana ↔ Katakana</option>
            </select>

            <div className="flex items-center gap-4">
              {!isPlaying ? (
                <button
                  onClick={handleStart}
                  className="px-6 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700
                    hover:bg-neutral-700 transition-colors text-sm"
                >
                  Start
                </button>
              ) : (
                <>
                  <div className="font-mono text-sm px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-700">
                    {formatTime(elapsedTime)}
                  </div>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setElapsedTime(0);
                      setScore(0);
                      setMatchedChars(new Set());
                    }}
                    className="px-6 py-2.5 bg-rose-500/20 text-rose-200 rounded-lg border border-rose-500/20
                      hover:bg-rose-500/30 transition-colors text-sm"
                  >
                    Stop
                  </button>
                </>
              )}

              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-700 text-sm">
                  {score} / {INITIAL_CHARACTERS.length}
                </div>
                <div className="px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-700 text-sm">
                  {Math.round((score / INITIAL_CHARACTERS.length) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {isPlaying ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-sm font-medium mb-6 text-neutral-400">
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
              <div className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-sm font-medium mb-6 text-neutral-400">
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
            <div className="text-center py-12">
              <p className="text-neutral-500 text-sm">
                Select a mode and click Start to begin matching characters
              </p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
} 