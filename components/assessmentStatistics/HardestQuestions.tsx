"use client"

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "../ui/skeleton";
import { fetchAssessmentPerformanceData } from "@/lib/analysisUtils/assessmentPerformance";

interface Question {
  questionId: string;
  question: string;
  correct_answer: string;
  percent_correct: string;
  incorrect_answers: Record<string, string>;
}

function HardestQuestions({ assessmentId }: { assessmentId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAssessmentPerformanceData({ assessmentId });
        if (!data || !data.questions || data.questions.length === 0) {
          throw new Error("No questions data available");
        }

        // Filter and process questions
        const processedQuestions = data.questions
          .filter(q => parseFloat(q.percent_correct) < 100) // Remove 100% correct questions
          .map(q => ({
            ...q,
            incorrect_answers: Object.fromEntries(
              Object.entries(q.incorrect_answers)
                // eslint-disable-next-line no-unused-vars
                .filter(([_, percentage]) => parseFloat(percentage) > 0)
            )
          }))
          .filter(q => Object.keys(q.incorrect_answers).length > 0); // Remove questions with no incorrect answers

        // Sort questions by percent correct (ascending)
        const sortedQuestions = processedQuestions.sort(
          (a, b) => parseFloat(a.percent_correct) - parseFloat(b.percent_correct)
        ).slice(0, 3);

        setQuestions(sortedQuestions);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch assessment data");
        setLoading(false);
      }
    }

    fetchData();
  }, [assessmentId]);

  if (loading)
    return (
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-[250px] w-full"/>
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  return (
    <div className="px-2">
      <Accordion type="single" collapsible className="w-full">
        {questions.map((question, index) => (
          <AccordionItem key={question.questionId} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              <span className="flex justify-between items-center w-full">
                <span className="flex-1 mr-4 text-sm">{question.question}</span>
                <span className="text-red-500 font-bold whitespace-nowrap mr-4">
                  {question.percent_correct}% correct
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <h3 className="font-semibold mb-2">Answer Statistics:</h3>
              <ul>
                <li className="mb-1 text-green-600">
                  Correct: {question.correct_answer} ({question.percent_correct}
                  %)
                </li>
                {Object.entries(question.incorrect_answers).map(
                  ([answer, percentage], i) => (
                    <li key={i} className="mb-1 text-red-600">
                      {answer} ({percentage}%)
                    </li>
                  )
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default HardestQuestions;
