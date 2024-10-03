import { Answer, AssessmentItem } from "@prisma/client";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface AttemptItemWrapperProps {
  item: AssessmentItem;
  answers?: Answer[];
  selectedAnswerId: string | null;
  // eslint-disable-next-line no-unused-vars
  onSelect: (answerId: string) => void;
}

export default function AttemptItemWrapper({
  item,
  answers,
  selectedAnswerId,
  onSelect,
}: AttemptItemWrapperProps) {
  const [randomizedAnswers, setRandomizedAnswers] = useState<Answer[]>([]);
  useEffect(() => {
    // Check if answers array exists
    if (answers) {
      // Create a copy of the answers array
      const shuffled = [...answers];
      
      // Fisher-Yates shuffle - https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Update the state with the shuffled answers
      setRandomizedAnswers(shuffled);
    }
  }, [answers]);
  if (item.type === "CONTEXT") {
    return <div className="whitespace-pre-wrap">{item.content}</div>;
  } else if (item.type === "MCQ") {
    return (
      <div>
        <p className="font-semibold mb-2">{item.content}</p>
        {randomizedAnswers.length > 0 && (
          <div className="space-y-2 pr-2">
            {randomizedAnswers.map((answer) => (
              <div
                key={answer.id}
                className="flex items-center justify-between"
              > 
                <span>{answer.content}</span>
                <Checkbox
                  checked={selectedAnswerId === answer.id}
                  onCheckedChange={() => onSelect(answer.id)}
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
