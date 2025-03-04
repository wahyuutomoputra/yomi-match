import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Japanese Writing System",
  description: "Learn Japanese writing system with interactive exercises",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster richColors closeButton position="top-center" />
            <footer className="border-t border-neutral-200 dark:border-neutral-800">
              <div className="container mx-auto px-4 py-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                © {new Date().getFullYear()} Japanese Writing System
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
