"use client";

import { useDrag } from "react-dnd";

interface DraggableCharacterProps {
  character: {
    id: string;
    romaji: string;
    hiragana: string;
    katakana: string;
  };
  mode: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function DraggableCharacter({ character, mode, isSelected, onSelect }: DraggableCharacterProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "character",
    item: { id: character.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const displayChar = mode.startsWith("romaji")
    ? character.romaji
    : mode.startsWith("hiragana")
    ? character.hiragana
    : character.katakana;

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      onClick={() => onSelect?.(character.id)}
      className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-lg sm:text-xl font-medium 
        bg-gradient-to-br cursor-pointer shadow-lg rounded-xl
        transition-all duration-200 hover:scale-105 active:scale-95
        ${isDragging ? "opacity-50 scale-105 rotate-3" : "opacity-100"}
        ${isSelected 
          ? "from-purple-500 to-pink-500 ring-2 ring-purple-400 ring-offset-2" 
          : "from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        }
        text-white`}
    >
      {displayChar}
    </div>
  );
} 