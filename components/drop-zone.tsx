"use client";

import { useDrop } from "react-dnd";
import { toast } from "sonner";

interface DropZoneProps {
  character: {
    id: string;
    romaji: string;
    hiragana: string;
    katakana: string;
  };
  mode: string;
  isMatched?: boolean;
  isActive?: boolean;
  onZoneClick?: () => void;
  onCorrectDrop?: () => void;
}

export function DropZone({ character, mode, isMatched, isActive, onZoneClick, onCorrectDrop }: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "character",
    drop: (item: { id: string }) => {
      if (item.id === character.id) {
        onCorrectDrop?.();
      } else {
        toast.error('Try again!', {
          className: 'bg-red-50 text-red-800 border-red-200',
          duration: 1000,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [character.id, onCorrectDrop]);

  const targetChar = mode.endsWith("hiragana")
    ? character.hiragana
    : character.katakana;

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      onClick={onZoneClick}
      className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-xl flex items-center justify-center
        font-medium transition-all duration-200 shadow-lg text-base sm:text-lg cursor-pointer
        ${isMatched ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-none" : ""}
        ${!isMatched && isOver && canDrop ? "border-green-400 bg-green-50 scale-105 rotate-3" : ""}
        ${!isMatched && isOver && !canDrop ? "border-red-400 bg-red-50 scale-105 -rotate-3" : ""}
        ${!isMatched && !isOver && isActive ? "border-purple-400 bg-purple-50 hover:bg-purple-100 hover:border-purple-500" : ""}
        ${!isMatched && !isOver && !isActive ? "border-dashed border-purple-300 bg-white/80 backdrop-blur-sm" : ""}`}
    >
      {targetChar}
    </div>
  );
} 