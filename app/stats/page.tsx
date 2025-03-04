"use client";

import { useState, useEffect } from "react";
import { getQuizResults, calculateCharacterStats } from "@/lib/utils";
import type { QuizResult, CharacterStats } from "@/lib/types";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function StatsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [characterStats, setCharacterStats] = useState<CharacterStats[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"all" | "week" | "month">("all");

  useEffect(() => {
    const allResults = getQuizResults();
    setResults(allResults);
    setCharacterStats(calculateCharacterStats(allResults));
  }, []);

  const filterResultsByTimeframe = (timeframe: "all" | "week" | "month") => {
    const allResults = getQuizResults();
    const now = new Date();
    
    let filteredResults = allResults;
    if (timeframe === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredResults = allResults.filter(r => new Date(r.date) >= weekAgo);
    } else if (timeframe === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredResults = allResults.filter(r => new Date(r.date) >= monthAgo);
    }

    setResults(filteredResults);
    setCharacterStats(calculateCharacterStats(filteredResults));
  };

  const overallStats = {
    totalQuizzes: results.length,
    totalQuestions: results.reduce((sum, r) => sum + r.totalQuestions, 0),
    totalCorrect: results.reduce((sum, r) => sum + r.correctAnswers, 0),
    averageAccuracy: results.length 
      ? (results.reduce((sum, r) => sum + (r.correctAnswers / r.totalQuestions * 100), 0) / results.length).toFixed(1)
      : "0",
  };

  const handleResetStats = async () => {
    const result = await Swal.fire({
      title: 'Reset Statistics',
      text: 'Are you sure you want to reset all statistics? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B5CF6', // violet-500
      cancelButtonColor: '#6B7280', // gray-500
      confirmButtonText: 'Yes, reset it!',
      cancelButtonText: 'Cancel',
      background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
      color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000',
    });

    if (result.isConfirmed) {
      localStorage.removeItem('quizResults');
      setResults([]);
      setCharacterStats([]);
      
      Swal.fire({
        title: 'Reset Complete!',
        text: 'Your statistics have been reset successfully.',
        icon: 'success',
        confirmButtonColor: '#8B5CF6',
        background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
        color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#000000',
      });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-[900px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="text-left space-y-2">
            <h1 className="text-2xl font-medium">Learning Statistics</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track your progress in learning Japanese characters
            </p>
          </div>
          
          <button
            onClick={handleResetStats}
            className="px-4 py-2 rounded-lg text-sm font-medium 
              bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Reset Stats
          </button>
        </div>

        {/* Timeframe Selection */}
        <div className="flex justify-center gap-2">
          {["all", "week", "month"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => filterResultsByTimeframe(timeframe as "all" | "week" | "month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedTimeframe === timeframe
                  ? "bg-violet-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Quizzes", value: overallStats.totalQuizzes },
            { label: "Total Questions", value: overallStats.totalQuestions },
            { label: "Correct Answers", value: overallStats.totalCorrect },
            { label: "Average Accuracy", value: `${overallStats.averageAccuracy}%` },
          ].map((stat, i) => (
            <div key={i} className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
              <div className="text-2xl font-medium mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Character Stats */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Character Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characterStats
              .sort((a, b) => b.totalAttempts - a.totalAttempts)
              .map((stat) => (
                <div 
                  key={stat.character}
                  className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{stat.character}</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {stat.totalAttempts} attempts
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-500"
                        style={{ width: `${stat.accuracy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accuracy: {stat.accuracy.toFixed(1)}%</span>
                      <span>{stat.correctAttempts} correct, {stat.wrongAttempts} wrong</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Recent Quizzes</h2>
          <div className="space-y-3">
            {results
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((result) => (
                <div 
                  key={result.id}
                  className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4"
                >
                  <div className="flex justify-between mb-2">
                    <div className="space-y-1">
                      <div className="font-medium">{result.mode} Quiz</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {result.correctAnswers}/{result.totalQuestions} correct
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 