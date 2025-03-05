"use client";

import { useState, useEffect } from "react";
import { INITIAL_CHARACTERS, DAKUON_CHARACTERS, type Character } from "@/lib/characters";
import { shuffleArray } from "@/lib/utils";
import { toast } from "sonner";
import { saveQuizResult } from "@/lib/utils";
import type { QuizResult } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

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
  const [basicCount, setBasicCount] = useState(10);
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
    if (characterSet === "custom" && (basicCount + dakuonCount) < 5) {
      toast.error("Please select at least 5 total characters for the quiz");
      return;
    }

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
    <div className="min-h-screen p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-white to-pink-100 
      dark:from-violet-950 dark:via-neutral-900 dark:to-pink-950">
      <div className="max-w-[600px] mx-auto py-8 space-y-8">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl"
            >
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  Japanese Quiz
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Master {quizMode === "hiragana" ? "Hiragana" : "Katakana"} through interactive quizzes
                </p>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                    Quiz Mode
                  </label>
                  <select
                    className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                      rounded-2xl px-4 py-3 focus:outline-none group-hover:ring-2 ring-violet-200
                      border border-neutral-200 dark:border-neutral-700 transition-all"
                    value={quizMode}
                    onChange={(e) => setQuizMode(e.target.value as QuizMode)}
                  >
                    <option value="hiragana">Hiragana Quiz</option>
                    <option value="katakana">Katakana Quiz</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                    Character Set
                  </label>
                  <select
                    className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                      rounded-2xl px-4 py-3 focus:outline-none group-hover:ring-2 ring-violet-200
                      border border-neutral-200 dark:border-neutral-700 transition-all"
                    value={characterSet}
                    onChange={(e) => setCharacterSet(e.target.value as CharacterSet)}
                  >
                    <option value="basic">Basic Characters (46)</option>
                    <option value="dakuon">Dakuon Characters (25)</option>
                    <option value="all">All Characters (71)</option>
                    <option value="custom">Custom Selection</option>
                  </select>
                </div>

                {characterSet === "custom" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
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
                        min="0"
                        max="25"
                        value={dakuonCount}
                        onChange={(e) => setDakuonCount(Math.min(25, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white 
                          rounded-2xl px-4 py-3 focus:outline-none 
                          border border-neutral-200 dark:border-neutral-800"
                      />
                    </div>

                    <div className="text-sm space-y-1">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Total characters: {basicCount + dakuonCount}
                      </p>
                      <p className="text-neutral-500 dark:text-neutral-500 text-xs">
                        Minimum 5 total characters required
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full py-4 rounded-2xl text-lg font-medium text-white
                  bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 
                  hover:to-pink-600 transition-all shadow-lg shadow-violet-500/20"
              >
                Start Quiz
              </motion.button>
            </motion.div>
          ) : isGameComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-8"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-block bg-gradient-to-br from-violet-500 to-pink-500 p-4 rounded-full"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  Quiz Complete!
                </h2>
                <div className="flex justify-center gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-green-50 dark:bg-green-900/30 px-6 py-4 rounded-2xl"
                  >
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {quizState.score}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">Correct</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-red-50 dark:bg-red-900/30 px-6 py-4 rounded-2xl"
                  >
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {quizState.wrongAnswers}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">Wrong</p>
                  </motion.div>
                </div>
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsPlaying(false)}
                className="w-full py-4 rounded-2xl text-lg font-medium text-white
                  bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 
                  hover:to-pink-600 transition-all shadow-lg shadow-violet-500/20"
              >
                Play Again
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-8"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium px-4 py-2 bg-violet-50 dark:bg-violet-900/30 
                    rounded-xl text-violet-600 dark:text-violet-400">
                    Question {quizState.currentIndex + 1}/{quizState.questions.length}
                  </span>
                  <span className="text-sm font-medium px-4 py-2 bg-pink-50 dark:bg-pink-900/30 
                    rounded-xl text-pink-600 dark:text-pink-400">
                    Score: {quizState.score}
                  </span>
                </div>
                <Progress value={(quizState.currentIndex / quizState.questions.length) * 100} />
              </div>

              <motion.div
                key={quizState.currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
                className="text-center py-12"
              >
                <motion.div 
                  className="text-9xl mb-6 font-bold bg-gradient-to-br from-violet-600 to-pink-600 
                    bg-clip-text text-transparent inline-block"
                  animate={{ 
                    scale: [1, 1.02, 1],
                    rotate: [0, -1, 1, -1, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {quizMode === "hiragana" 
                    ? currentQuestion.character.hiragana
                    : currentQuestion.character.katakana
                  }
                </motion.div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !currentQuestion.isSubmitted && handleAnswer(option)}
                    disabled={currentQuestion.isSubmitted}
                    className={`py-4 px-6 rounded-xl text-lg font-medium transition-all ${
                      currentQuestion.isSubmitted
                        ? option === currentQuestion.character.romaji
                          ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                          : option === currentQuestion.answered
                            ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                            : "bg-neutral-100 dark:bg-neutral-700"
                        : currentQuestion.answered === option
                          ? "bg-violet-100 dark:bg-violet-800 text-violet-800 dark:text-violet-100"
                          : "bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 shadow-lg"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>

              {!currentQuestion.isSubmitted && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="w-full py-4 rounded-2xl text-lg font-medium text-white
                    bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 
                    hover:to-pink-600 transition-all shadow-lg shadow-violet-500/20"
                >
                  Submit Answer
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 