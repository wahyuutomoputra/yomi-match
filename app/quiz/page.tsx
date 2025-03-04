"use client";

import { useState, useEffect } from "react";
import { INITIAL_CHARACTERS, DAKUON_CHARACTERS, type Character } from "@/lib/characters";
import { shuffleArray } from "@/lib/utils";
import { toast } from "sonner";
import { saveQuizResult } from "@/lib/utils";
import type { QuizResult } from "@/lib/types";

type CharacterSet = "basic" | "dakuon" | "all" | "custom";
type QuizMode = "hiragana" | "katakana";

interface QuizState {
  currentIndex: number;
  score: number;
  wrongAnswers: number;
  questions: {
    character: Character;
    options: string[];
    answered?: string;
    isSubmitted?: boolean;
  }[];
}

export default function QuizPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [characterSet, setCharacterSet] = useState<CharacterSet>("basic");
  const [quizMode, setQuizMode] = useState<QuizMode>("hiragana");
  const [basicCount, setBasicCount] = useState(5);
  const [dakuonCount, setDakuonCount] = useState(5);
  const [quizState, setQuizState] = useState<QuizState>({
    currentIndex: 0,
    score: 0,
    wrongAnswers: 0,
    questions: [],
  });

  const getActiveCharacters = () => {
    switch (characterSet) {
      case "basic":
        return INITIAL_CHARACTERS;
      case "dakuon":
        return DAKUON_CHARACTERS;
      case "all":
        return [...INITIAL_CHARACTERS, ...DAKUON_CHARACTERS];
      case "custom":
        const shuffledBasic = shuffleArray(INITIAL_CHARACTERS).slice(0, basicCount);
        const shuffledDakuon = shuffleArray(DAKUON_CHARACTERS).slice(0, dakuonCount);
        return [...shuffledBasic, ...shuffledDakuon];
      default:
        return INITIAL_CHARACTERS;
    }
  };

  const generateQuestions = () => {
    const activeChars = getActiveCharacters();
    const shuffledChars = shuffleArray(activeChars);
    const allChars = [...INITIAL_CHARACTERS, ...DAKUON_CHARACTERS];

    return shuffledChars.map(char => {
      // Get 4 wrong options
      const wrongOptions = shuffleArray(
        allChars
          .filter(c => c.id !== char.id)
          .map(c => c.romaji)
      ).slice(0, 4);

      // Add correct answer and shuffle
      const options = shuffleArray([char.romaji, ...wrongOptions]);

      return {
        character: char,
        options,
      };
    });
  };

  const handleStart = () => {
    setQuizState({
      currentIndex: 0,
      score: 0,
      wrongAnswers: 0,
      questions: generateQuestions(),
    });
    setIsPlaying(true);
  };

  const handleAnswer = (answer: string) => {
    setQuizState(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === prev.currentIndex ? { ...q, answered: answer } : q
      ),
    }));
  };

  const handleSubmit = () => {
    const currentQuestion = quizState.questions[quizState.currentIndex];
    if (!currentQuestion.answered) {
      toast.error("Please select an answer first!");
      return;
    }

    const isCorrect = currentQuestion.answered === currentQuestion.character.romaji;

    if (isCorrect) {
      toast.success("Correct answer! 🎉");
    } else {
      toast.error(`Wrong! The correct answer is "${currentQuestion.character.romaji}"`);
    }

    setQuizState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      wrongAnswers: isCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1,
      questions: prev.questions.map((q, i) => 
        i === prev.currentIndex ? { ...q, isSubmitted: true } : q
      ),
    }));

    // Wait a bit before moving to next question
    setTimeout(() => {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
    }, 1500);

    if (isGameComplete) {
      const quizResult: QuizResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mode: quizMode,
        characterSet,
        totalQuestions: quizState.questions.length,
        correctAnswers: quizState.score,
        wrongAnswers: quizState.wrongAnswers,
        questions: quizState.questions.map(q => ({
          character: quizMode === "hiragana" ? q.character.hiragana : q.character.katakana,
          correct: q.answered === q.character.romaji,
          userAnswer: q.answered || "",
          correctAnswer: q.character.romaji
        }))
      };
      
      saveQuizResult(quizResult);
      toast.success("Quiz results saved!");
    }
  };

  const isGameComplete = quizState.currentIndex === quizState.questions.length;

  const currentQuestion = quizState.questions[quizState.currentIndex] || null;

  // Tambahkan useEffect untuk menyimpan hasil saat game selesai
  useEffect(() => {
    if (isGameComplete && quizState.questions.length > 0) {
      const quizResult: QuizResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mode: quizMode,
        characterSet,
        totalQuestions: quizState.questions.length,
        correctAnswers: quizState.score,
        wrongAnswers: quizState.wrongAnswers,
        questions: quizState.questions.map(q => ({
          character: quizMode === "hiragana" ? q.character.hiragana : q.character.katakana,
          correct: q.answered === q.character.romaji,
          userAnswer: q.answered || "",
          correctAnswer: q.character.romaji
        }))
      };
      
      saveQuizResult(quizResult);
      toast.success("Quiz results saved!");
    }
  }, [isGameComplete, quizState.questions]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-[520px] mx-auto space-y-6">
        {!isPlaying ? (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-medium">Japanese Quiz</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Test your knowledge of Japanese characters
              </p>
            </div>

            <select
              className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                rounded-2xl px-4 py-3 focus:outline-none 
                border border-neutral-200 dark:border-neutral-800"
              value={quizMode}
              onChange={(e) => setQuizMode(e.target.value as QuizMode)}
            >
              <option value="hiragana">Hiragana Quiz</option>
              <option value="katakana">Katakana Quiz</option>
            </select>

            <select
              className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                rounded-2xl px-4 py-3 focus:outline-none 
                border border-neutral-200 dark:border-neutral-800"
              value={characterSet}
              onChange={(e) => setCharacterSet(e.target.value as CharacterSet)}
            >
              <option value="basic">Basic Characters (46)</option>
              <option value="dakuon">Dakuon Characters (25)</option>
              <option value="all">All Characters (71)</option>
              <option value="custom">Custom Selection</option>
            </select>

            {characterSet === "custom" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Basic Characters (1-46)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="46"
                    value={basicCount}
                    onChange={(e) => setBasicCount(Math.min(46, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                      rounded-2xl px-4 py-3 focus:outline-none 
                      border border-neutral-200 dark:border-neutral-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Dakuon Characters (1-25)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={dakuonCount}
                    onChange={(e) => setDakuonCount(Math.min(25, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                      rounded-2xl px-4 py-3 focus:outline-none 
                      border border-neutral-200 dark:border-neutral-800"
                  />
                </div>

                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Total characters: {basicCount + dakuonCount}
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full py-3 rounded-2xl text-sm font-medium text-white
                bg-violet-500 hover:bg-violet-600 transition-colors"
            >
              Start Quiz
            </button>
          </>
        ) : isGameComplete ? (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium">Quiz Complete!</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                You got {quizState.score} correct out of {quizState.questions.length} questions
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">
                Wrong answers: {quizState.wrongAnswers}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Review Your Answers:</h3>
              <div className="space-y-4">
                {quizState.questions.map((q, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl text-sm
                      ${q.answered === q.character.romaji
                        ? "bg-green-50 dark:bg-green-900/30"
                        : "bg-red-50 dark:bg-red-900/30"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">
                        {quizMode === "hiragana" ? q.character.hiragana : q.character.katakana}
                      </span>
                      <span>Question {index + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <p>Your answer: <span className="font-medium">{q.answered}</span></p>
                      <p>Correct answer: <span className="font-medium">{q.character.romaji}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsPlaying(false)}
              className="w-full py-3 rounded-2xl text-sm font-medium text-white
                bg-violet-500 hover:bg-violet-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <span>Question {quizState.currentIndex + 1}/{quizState.questions.length}</span>
              <span>Score: {quizState.score}</span>
            </div>

            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {quizMode === "hiragana" 
                  ? currentQuestion.character.hiragana
                  : currentQuestion.character.katakana
                }
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !currentQuestion.isSubmitted && handleAnswer(option)}
                  disabled={currentQuestion.isSubmitted}
                  className={`
                    py-3 px-4 rounded-xl text-sm font-medium transition-colors
                    ${currentQuestion.isSubmitted
                      ? option === currentQuestion.character.romaji
                        ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                        : option === currentQuestion.answered
                          ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                          : "bg-neutral-100 dark:bg-neutral-800"
                      : currentQuestion.answered === option
                        ? "bg-violet-100 dark:bg-violet-800"
                        : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {!currentQuestion.isSubmitted && (
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl text-sm font-medium text-white
                  bg-violet-500 hover:bg-violet-600 transition-colors"
              >
                Submit Answer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 