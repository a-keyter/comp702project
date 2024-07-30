"use client";

import { Answer, AssessmentItem } from "@prisma/client";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface PreviewItemWrapperProps {
  item: AssessmentItem;
  answers?: Answer[];
}

export default function PreviewItemWrapper({
  item,
  answers,
}: PreviewItemWrapperProps) {
  const [randomizedAnswers, setRandomizedAnswers] = useState<Answer[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  useEffect(() => {
    if (answers) {
      const shuffled = [...answers].sort(() => Math.random() - 0.5);
      setRandomizedAnswers(shuffled);
    }
  }, [answers]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswerId(answerId === selectedAnswerId ? null : answerId);
  };

  if (item.type === "CONTEXT") {
    return <div className="whitespace-pre-wrap">{item.content}</div>;
  } else if (item.type === "MCQ") {
    return (
      <div>
        <p className="font-semibold mb-2">{item.content}</p>
        {randomizedAnswers.length > 0 && (
          <div className="space-y-2">
            {randomizedAnswers.map((answer) => (
              <div key={answer.id} className="flex items-center justify-between">
                <span className={answer.isCorrect ? "text-green-600" : ""}>
                  {answer.content}
                  {answer.isCorrect && " (Correct)"}
                </span>
                <Checkbox
                  checked={selectedAnswerId === answer.id}
                  onCheckedChange={() => handleAnswerSelect(answer.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}