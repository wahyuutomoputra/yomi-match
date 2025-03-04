"use client";

import { INITIAL_CHARACTERS, DAKUON_CHARACTERS } from "@/lib/characters";
import { Container } from "@/components/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katakana Guide",
  description: "Learn Katakana, the Japanese alphabet used for foreign words. Complete guide with pronunciation and writing.",
  openGraph: {
    title: "Katakana Guide - Japanese Writing System",
    description: "Learn the Japanese alphabet for foreign words"
  }
};

export default function KatakanaPage() {
  return (
    <Container>
      <div className="space-y-12">
        <section className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white p-8 rounded-2xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              Katakana Guide
            </h1>
            <p className="text-lg text-white/90 max-w-prose">
              Learn the Japanese alphabet used for foreign words and emphasis
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Basic Characters</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              The core katakana characters representing basic sounds
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {INITIAL_CHARACTERS.map((char) => (
              <div
                key={char.id}
                className="flex items-center justify-between p-6 rounded-xl 
                  hover:shadow-lg hover:scale-105 transition-all 
                  border border-neutral-200 dark:border-neutral-800
                  bg-white dark:bg-neutral-900"
              >
                <span className="text-3xl font-medium bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {char.katakana}
                </span>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {char.romaji}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Dakuon Characters</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Modified characters with dakuten (゛) and handakuten (゜) marks for voiced sounds
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {DAKUON_CHARACTERS.map((char) => (
              <div
                key={char.id}
                className="flex items-center justify-between p-6 rounded-xl 
                  hover:shadow-lg hover:scale-105 transition-all 
                  border border-neutral-200 dark:border-neutral-800
                  bg-white dark:bg-neutral-900"
              >
                <span className="text-3xl font-medium bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {char.katakana}
                </span>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {char.romaji}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-medium mb-2">About Dakuon in Katakana</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Just like in hiragana, katakana uses dakuten (゛) and handakuten (゜) marks to create voiced sounds. 
              For example, カ (ka) becomes ガ (ga), ハ (ha) becomes バ (ba) with dakuten, or パ (pa) with handakuten. 
              These are commonly used in foreign loan words.
            </p>
          </div>
        </section>
      </div>
    </Container>
  );
}
