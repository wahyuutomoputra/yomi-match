"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Menu, Home, Brain, Keyboard, BarChart3, Book } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/90 backdrop-blur-md z-50">
      <div className="w-full max-w-[900px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent 
              group-hover:from-violet-600 group-hover:to-purple-700 transition-all">
              Japanese Writing System
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-2">
              <NavLink href="/" active={pathname === "/"}>
                <Home className="w-4 h-4" />
                Home
              </NavLink>
              <NavLink href="/quiz" active={pathname === "/quiz"}>
                <Brain className="w-4 h-4" />
                Quiz
              </NavLink>
              <NavLink href="/typing-game" active={pathname === "/typing-game"}>
                <Keyboard className="w-4 h-4" />
                Typing
              </NavLink>
              <NavLink href="/stats" active={pathname === "/stats"}>
                <BarChart3 className="w-4 h-4" />
                Stats
              </NavLink>
              <NavLink href="/hiragana" active={pathname === "/hiragana"}>
                <Book className="w-4 h-4" />
                Hiragana
              </NavLink>
              <NavLink href="/katakana" active={pathname === "/katakana"}>
                <Book className="w-4 h-4" />
                Katakana
              </NavLink>
            </div>
            <div className="pl-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors
                hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-800"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 
                bg-white dark:bg-neutral-900 shadow-lg"
            >
              <div className="space-y-1 p-2">
                <NavLink href="/" active={pathname === "/"} isMobile>
                  <Home className="w-4 h-4" />
                  Home
                </NavLink>
                <NavLink href="/quiz" active={pathname === "/quiz"} isMobile>
                  <Brain className="w-4 h-4" />
                  Quiz
                </NavLink>
                <NavLink href="/typing-game" active={pathname === "/typing-game"} isMobile>
                  <Keyboard className="w-4 h-4" />
                  Typing Game
                </NavLink>
                <NavLink href="/stats" active={pathname === "/stats"} isMobile>
                  <BarChart3 className="w-4 h-4" />
                  Stats
                </NavLink>
                <NavLink href="/hiragana" active={pathname === "/hiragana"} isMobile>
                  <Book className="w-4 h-4" />
                  Hiragana
                </NavLink>
                <NavLink href="/katakana" active={pathname === "/katakana"} isMobile>
                  <Book className="w-4 h-4" />
                  Katakana
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
  isMobile?: boolean;
}

function NavLink({ href, active, children, isMobile }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`
        ${isMobile ? "block w-full" : "inline-block"} 
        px-3.5 py-2 rounded-lg text-sm font-medium transition-all
        flex items-center gap-2 hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-800
        ${
          active
            ? "bg-violet-500 text-white hover:bg-violet-600"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }
      `}
    >
      {children}
    </Link>
  );
}
