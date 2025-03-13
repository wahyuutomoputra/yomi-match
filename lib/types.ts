export interface QuizResult {
  id: string;
  date: string;
  mode: "hiragana" | "katakana" | "both";
  characterSet: "basic" | "dakuon" | "all" | "custom";
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  questions: {
    character: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface CharacterStats {
  character: string;
  totalAttempts: number;
  correctAttempts: number;
  wrongAttempts: number;
  accuracy: number;
} 