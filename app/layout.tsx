import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Providers } from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Learn Japanese',
    default: 'Learn Japanese - Master Hiragana and Katakana',
  },
  description: "Learn Japanese writing systems - Hiragana and Katakana through interactive exercises and quizzes. Free Japanese learning tool.",
  keywords: ["learn japanese", "hiragana", "katakana", "japanese writing", "japanese alphabet", "japanese quiz"],
  authors: [{ name: "Wahyu Utomo Putra" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Learn Japanese",
    description: "Master Japanese writing systems through interactive exercises",
    images: [
      {
        url: "/og-image.jpg", // Add your OG image
        width: 1200,
        height: 630,
        alt: "Learn Japanese Writing Systems"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Japanese - Master Hiragana and Katakana",
    description: "Interactive Japanese writing system learning platform",
    images: ["/og-image.jpg"], // Add your Twitter card image
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Toaster richColors closeButton position="top-center" />
            <footer className="border-t border-neutral-200 dark:border-neutral-800">
              <div className="container mx-auto px-4 py-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                © {new Date().getFullYear()} Japanese Writing System
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
