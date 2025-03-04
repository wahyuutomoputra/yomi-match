"use client";

import { Container } from "@/components/container";
import { INITIAL_CHARACTERS, DAKUON_CHARACTERS } from "@/lib/characters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiragana Guide",
  description: "Learn Hiragana, the basic Japanese phonetic alphabet. Complete guide with pronunciation and writing.",
  openGraph: {
    title: "Hiragana Guide - Japanese Writing System",
    description: "Learn the basic Japanese phonetic alphabet"
  }
};

export default function HiraganaPage() {
  return (
    <Container>
      <div className="space-y-12">
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

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Basic Characters</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              The core hiragana characters representing basic sounds
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
                <span className="text-3xl font-medium bg-gradient-to-br from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {char.hiragana}
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
                <span className="text-3xl font-medium bg-gradient-to-br from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {char.hiragana}
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
            <h3 className="text-lg font-medium mb-2">About Dakuon</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Dakuon (濁音) are voiced variants of basic hiragana characters, created by adding dakuten (゛) or 
              handakuten (゜) marks. For example, か (ka) becomes が (ga), は (ha) becomes ば (ba) with dakuten, 
              or ぱ (pa) with handakuten.
            </p>
          </div>
        </section>
      </div>
    </Container>
  );
}
