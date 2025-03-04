"use client";

import { INITIAL_CHARACTERS } from "@/components/japanese-converter";

export default function HiraganaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="w-full max-w-[520px] mx-auto px-4 py-4">
        <h1 className="text-xl font-normal text-black dark:text-white mb-6">
          Hiragana List
        </h1>
        
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INITIAL_CHARACTERS.map((char) => (
              <div 
                key={char.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-black"
              >
                <span className="text-xl font-medium">{char.hiragana}</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {char.romaji}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 