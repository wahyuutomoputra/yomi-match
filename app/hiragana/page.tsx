"use client";

import { Container } from "@/components/container";
import { INITIAL_CHARACTERS } from "@/lib/characters";

export default function HiraganaPage() {
  return (
    <Container>
      {" "}
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-8 rounded-2xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              Hiragana Guide
            </h1>
            <p className="text-lg text-white/90 max-w-prose">
              Learn the basic Japanese phonetic alphabet used for native
              Japanese words
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {INITIAL_CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="flex items-center justify-between p-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all border border-neutral-200 dark:border-neutral-800"
            >
              <span className="text-3xl font-medium bg-gradient-to-br from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {char.hiragana}
              </span>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {char.romaji}
              </span>
            </div>
          ))}
        </div>
      </div>{" "}
    </Container>
  );
}
