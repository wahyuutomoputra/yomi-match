import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { QuizResult, CharacterStats } from "./types"

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

export function saveQuizResult(result: QuizResult) {
  const results = getQuizResults();
  results.push(result);
  localStorage.setItem('quizResults', JSON.stringify(results));
}

export function getQuizResults(): QuizResult[] {
  const results = localStorage.getItem('quizResults');
  return results ? JSON.parse(results) : [];
}

export function calculateCharacterStats(results: QuizResult[]): CharacterStats[] {
  const stats = new Map<string, CharacterStats>();

  results.forEach(result => {
    result.questions.forEach(q => {
      const current = stats.get(q.character) || {
        character: q.character,
        totalAttempts: 0,
        correctAttempts: 0,
        wrongAttempts: 0,
        accuracy: 0
      };

      current.totalAttempts++;
      if (q.correct) {
        current.correctAttempts++;
      } else {
        current.wrongAttempts++;
      }
      current.accuracy = (current.correctAttempts / current.totalAttempts) * 100;

      stats.set(q.character, current);
    });
  });

  return Array.from(stats.values());
} 