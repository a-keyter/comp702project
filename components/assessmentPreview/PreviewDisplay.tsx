import { Answer, AssessmentItem } from "@prisma/client";
import { Button } from "../ui/button";
import Link from "next/link";
import PreviewItemWrapper from "./PreviewItemWrapper";
import { Card } from "../ui/card";

interface PreviewDisplayProps {
  assessmentId: string;
  classId: string;
  classTitle: string;
  assessmentTitle: string;
  assessmentObjectives: string;
  assessmentUpdated: string;
  items: AssessmentItem[];
  mcqAnswers: Record<string, Answer[]>;
}

function PreviewDisplay({
  assessmentId,
  assessmentTitle,
  classId,
  classTitle,
  assessmentObjectives,
  assessmentUpdated,
  items,
  mcqAnswers,
}: PreviewDisplayProps) {
  return (
    <div className="flex flex-col gap-y-2 w-full py-1">
      <Card className="flex flex-col p-2 gap-y-2">
        <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-2xl font-bold">{assessmentTitle}</h2>
          <p>
            Class: {classId.toUpperCase()} - {classTitle}
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex space-x-4 justify-end">
            <Link href={`/assessments/${assessmentId}`}>
              <Button className="bg-yellow-300 text-black hover:text-white">
                Close Preview
              </Button>
            </Link>
          </div>
          <p className="text-right">
            <strong>Last Updated:</strong> {assessmentUpdated}
          </p>
        </div>
        
        </div>
        <p>
        <strong>Assessment Objectives: </strong>
        {assessmentObjectives}
        </p>
      </Card>
      
      {items.map((item, index) => (
        <Card
          key={item.id}
          className="flex flex-col border-2 p-2 rounded-md w-full"
        >
          <PreviewItemWrapper
            item={item}
            answers={item.type === "MCQ" ? mcqAnswers[item.id] : undefined}
          />
        </Card>
      ))}
    </div>
  );
}

export default PreviewDisplay;