import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type CharacterStats, type QuizResult } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function saveQuizResult(result: any) {
  const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
  results.push(result);
  localStorage.setItem('quizResults', JSON.stringify(results));
}

export function getQuizResults(): QuizResult[] {
  return JSON.parse(localStorage.getItem('quizResults') || '[]');
}

export function calculateCharacterStats(results: QuizResult[]): CharacterStats[] {
  const stats = new Map<string, CharacterStats>();

  results.forEach(result => {
    result.questions.forEach(question => {
      const char = question.character;
      const current = stats.get(char) || {
        character: char,
        totalAttempts: 0,
        correctAttempts: 0,
        wrongAttempts: 0,
        accuracy: 0
      };

      current.totalAttempts++;
      if (question.correct) {
        current.correctAttempts++;
      } else {
        current.wrongAttempts++;
      }
      current.accuracy = (current.correctAttempts / current.totalAttempts) * 100;

      stats.set(char, current);
    });
  });

  return Array.from(stats.values()).sort((a, b) => b.totalAttempts - a.totalAttempts);
}
