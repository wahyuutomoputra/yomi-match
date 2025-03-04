"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-neutral-800 dark:bg-neutral-100 
        hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-neutral-200 dark:text-neutral-700" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-200 dark:text-neutral-700" />
      )}
    </button>
  );
} 