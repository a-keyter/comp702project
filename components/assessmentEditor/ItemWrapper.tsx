import { Answer, AssessmentItem } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, ChangeEvent } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkle } from "lucide-react";

interface ItemWrapperProps {
  item: AssessmentItem;
  answers?: Answer[];
  onUpdateItem: (updates: Partial<AssessmentItem>) => void;
  onUpdateAnswer: (answerId: string, updates: Partial<Answer>) => void;
  onGenerateFullMcq: () => void;
  onGenerateAnswers: () => void;
  onGenerateFalseAnswers: () => void;
}

interface AutoResizeInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  rows?: number;
}

function AutoResizeInput({ value, onChange, placeholder, className, rows}: AutoResizeInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={inputRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className}`}
      rows={rows? rows : 1}
    />
  );
}

export default function ItemWrapper({
  item,
  answers,
  onUpdateItem,
  onUpdateAnswer,
  onGenerateFullMcq,
  onGenerateAnswers,
  onGenerateFalseAnswers,
}: ItemWrapperProps) {
  if (item.type === "CONTEXT") {
    return (
      <>
        <AutoResizeInput
          value={item.content}
          onChange={(e) => onUpdateItem({ content: e.target.value })}
          placeholder="Enter contextual information..."
          className="w-full my-1 p-2 border rounded"
          rows={3}
        />
      </>
    );
  } else if (item.type === "MCQ") {
    const hasCorrectAnswer = answers?.some(answer => answer.isCorrect && answer.content.trim() !== '');
    return (
      <>
        <div className="flex gap-x-2 py-1 items-center">
          <AutoResizeInput
            value={item.content}
            onChange={(e) => onUpdateItem({ content: e.target.value })}
            placeholder="Enter multiple choice question..."
            className="w-full my-1 p-2 border rounded"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>AI Magic</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Generate AI MCQs</DropdownMenuLabel>
              <DropdownMenuItem title="Generate a question based on the assessment title and objectives"
                onSelect={onGenerateFullMcq}
              >
                Generate Question & Answer
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onGenerateAnswers}
                disabled={!item.content.trim()}
                title={!item.content.trim() ? "Please enter a question first" : "Generate answers for the current question"}
              >
                Generate All Answers
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onGenerateFalseAnswers}
                disabled={!item.content.trim() || !hasCorrectAnswer}
                title={!item.content.trim() ? "Please enter a question first" : 
                       !hasCorrectAnswer ? "Please set a correct answer first" : 
                       "Generate false answers for the current question"}
              >
                Generate False Answers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {answers &&
          answers.map((answer) => (
            <div
              key={answer.id}
              className={
                answer.isCorrect
                  ? "bg-green-100 w-full flex gap-x-2 items-center py-2 my-1 rounded-lg"
                  : "bg-red-200 w-full flex gap-x-2 items-center py-2 my-1 rounded-lg"
              }
            >
              <input
                type="checkbox"
                checked={answer.isCorrect}
                className="ml-2"
                readOnly
              />
              <AutoResizeInput
                value={answer.content}
                onChange={(e) =>
                  onUpdateAnswer(answer.id, { content: e.target.value })
                }
                placeholder={
                  answer.isCorrect
                    ? "Write the correct answer for the question here..."
                    : "Write an incorrect answer for the question here"
                }
                className="w-full bg-inherit mr-4 p-2"
              />
            </div>
          ))}
      </>
    );
  }

  return null;
}