"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function NavBar() {
  const pathname = usePathname();
  
  return (
    <div className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
      <div className="w-full max-w-[900px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-normal text-black dark:text-white">
            Japanese Writing System
          </h1>
          <ThemeToggle />
        </div>
        
        <div className="flex gap-1">
          <Link 
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname === "/" 
                ? "bg-violet-500 text-white" 
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
          >
            Game
          </Link>
          <Link 
            href="/hiragana"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname === "/hiragana" 
                ? "bg-violet-500 text-white" 
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
          >
            Hiragana
          </Link>
          <Link 
            href="/katakana"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname === "/katakana" 
                ? "bg-violet-500 text-white" 
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
          >
            Katakana
          </Link>
        </div>
      </div>
    </div>
  );
} 