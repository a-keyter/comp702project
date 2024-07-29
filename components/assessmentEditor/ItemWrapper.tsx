import { Answer, AssessmentItem } from "@prisma/client";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface ItemWrapperProps {
  item: AssessmentItem;
  index: number;
  answers?: Answer[];
  onUpdateItem: (updates: Partial<AssessmentItem>) => void;
  onUpdateAnswer: (answerId: string, updates: Partial<Answer>) => void;
}

export default function ItemWrapper({
  item,
  index,
  answers,
  onUpdateItem,
  onUpdateAnswer,
}: ItemWrapperProps) {
  if (item.type === "CONTEXT") {
    return (
      <>
      <div className="flex justify-between items-center my-2">
        <p className="text-sm">Context Block</p>
        <div className="flex gap-x-2">
        <Button className="py-1" disabled={index === 0}>Up</Button>
        <Button>Down</Button>
        </div>
      </div>
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
        
      <div className="flex justify-between items-center my-2">
        <p className="text-sm">MCQ Block</p>
        <div className="flex gap-x-2">
          <Button className="py-1" disabled={index === 0}>Up</Button>
          <Button>Down</Button>
        </div>
      </div>
        <Input
          value={item.content}
          onChange={(e) => onUpdateItem({ content: e.target.value })}
          placeholder="Enter multiple choice question..."
          className="w-full"
        />
        {answers &&
          answers.map((answer) => (
              <div key={answer.id} className={answer.isCorrect ? "bg-green-100 w-full flex gap-x-2 items-center py-2 my-1": "bg-inherit w-full flex gap-x-2 items-center py-1 my-1"}>
              <input
                type="checkbox"
                checked={answer.isCorrect}
                className="ml-2"
              />

              <input
                type="text"
                placeholder={answer.isCorrect ? "Write the correct answer for the question here..." : "Write an incorrect answer for the question here"}
                value={answer.content}
                onChange={(e) =>
                  onUpdateAnswer(answer.id, { content: e.target.value })
                }
                className="w-full bg-inherit mr-4"
              />
            </div>
          ))}
                </>

    );
  }

  return null;
}
