"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Menu } from "lucide-react";
import { useState } from "react";

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50">
      <div className="w-full max-w-[900px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
            Japanese Writing System
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-1">
              <NavLink href="/" active={pathname === "/"}>
                Game
              </NavLink>
              <NavLink href="/quiz" active={pathname === "/quiz"}>
                Quiz
              </NavLink>
              <NavLink href="/stats" active={pathname === "/stats"}>
                Stats
              </NavLink>
              <NavLink href="/hiragana" active={pathname === "/hiragana"}>
                Hiragana
              </NavLink>
              <NavLink href="/katakana" active={pathname === "/katakana"}>
                Katakana
              </NavLink>
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* <ThemeToggle /> */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <NavLink href="/" active={pathname === "/"} isMobile>
              Game
            </NavLink>
            <NavLink href="/quiz" active={pathname === "/quiz"} isMobile>
              Quiz
            </NavLink>
            <NavLink href="/stats" active={pathname === "/stats"} isMobile>
              Stats
            </NavLink>
            <NavLink
              href="/hiragana"
              active={pathname === "/hiragana"}
              isMobile
            >
              Hiragana
            </NavLink>
            <NavLink
              href="/katakana"
              active={pathname === "/katakana"}
              isMobile
            >
              Katakana
            </NavLink>
          </div>
        )}
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
        px-4 py-2 rounded-lg text-sm font-medium transition-all
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
