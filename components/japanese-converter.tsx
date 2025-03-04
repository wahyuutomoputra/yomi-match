"use client";

import { useState } from "react";
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
  const [mode, setMode] = useState<"romaji-hiragana" | "romaji-katakana" | "hiragana-katakana">("romaji-hiragana");
  const [score, setScore] = useState(0);
  const [matchedChars, setMatchedChars] = useState<Set<string>>(new Set());
  const [sourceOrder, setSourceOrder] = useState(() => shuffleArray(INITIAL_CHARACTERS));
  const [dropOrder, setDropOrder] = useState(() => shuffleArray(INITIAL_CHARACTERS));
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

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
    setMode(newMode);
    setScore(0);
    setMatchedChars(new Set());
    setSourceOrder(shuffleArray(INITIAL_CHARACTERS));
    setDropOrder(shuffleArray(INITIAL_CHARACTERS));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="relative z-50">
          <Toaster position="top-center" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/80 p-4 sm:p-6 rounded-2xl shadow-xl border border-purple-100 mb-4 sm:mb-8">
          <select
            className="select bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium 
              w-full max-w-xs border-none shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base"
            value={mode}
            onChange={(e) => handleModeChange(e.target.value as typeof mode)}
          >
            <option value="romaji-hiragana">Romaji → Hiragana</option>
            <option value="romaji-katakana">Romaji → Katakana</option>
            <option value="hiragana-katakana">Hiragana ↔ Katakana</option>
          </select>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-xl shadow-md text-sm">
              Score: {score}
            </div>
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1.5 rounded-xl shadow-md text-sm">
              {Math.round((score / INITIAL_CHARACTERS.length) * 100)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8">
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-2xl shadow-xl border border-indigo-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Source Characters
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
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

          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-2xl shadow-xl border border-pink-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text">
              Drop Zone
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 justify-items-center">
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
      </div>
    </DndProvider>
  );
} 