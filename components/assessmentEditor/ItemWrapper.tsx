import { Answer, AssessmentItem } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
}

export default function ItemWrapper({
  item,
  answers,
  onUpdateItem,
  onUpdateAnswer,
  onGenerateFullMcq,
}: ItemWrapperProps) {
  if (item.type === "CONTEXT") {
    return (
      <>
        <Textarea
          value={item.content}
          onChange={(e) => onUpdateItem({ content: e.target.value })}
          placeholder="Enter contextual information..."
        />
      </>
    );
  } else if (item.type === "MCQ") {
    return (
      <>
        <div className="flex gap-x-2 py-1 items-center">
          <Input
            value={item.content}
            onChange={(e) => onUpdateItem({ content: e.target.value })}
            placeholder="Enter multiple choice question..."
            className="w-full my-1"
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
              <DropdownMenuItem title="Generate answers to the MCQ">
                Generate All Answers
              </DropdownMenuItem>
              <DropdownMenuItem>Generate Incorrect Answers</DropdownMenuItem>
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
              <input
                type="text"
                placeholder={
                  answer.isCorrect
                    ? "Write the correct answer for the question here..."
                    : "Write an incorrect answer for the question here"
                }
                value={answer.content}
                onChange={(e) =>
                  onUpdateAnswer(answer.id, { content: e.target.value })
                }
                className="w-full bg-inherit mr-4"
              />
              <Button
                variant={"ghost"}
                className="mr-2 p-1 h-8"
                title={
                  answer.isCorrect
                    ? "AI Generated answer may be incorrect."
                    : ""
                }
              >
                <Sparkle/>
              </Button>
            </div>
          ))}
      </>
    );
  }

  return null;
}
