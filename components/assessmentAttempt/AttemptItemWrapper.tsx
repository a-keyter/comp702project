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
    if (answers) {
      const shuffled = [...answers].sort(() => Math.random() - 0.5);
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
